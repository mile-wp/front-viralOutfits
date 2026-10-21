import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import { IconFilter, IconSearch } from '../components/ui/Icons';
import FilterSidebar from '../components/catalog/FilterSidebar';
import ActiveFilters from '../components/catalog/ActiveFilters';
import SortSelect from '../components/catalog/SortSelect';
import ProductGrid from '../components/product/ProductGrid';
import { useRequest } from '../hooks/useRequest';
import { getProductos } from '../services/productService';
import { getCategorias } from '../services/categoriaService';
import { formatPrice } from '../utils/format';
import {
  coincideBusqueda,
  compararTalles,
  getCategoriaNombre,
  getColorHex,
  getNuevosIds,
  getStockTotal,
} from '../utils/product';
import './ProductList.css';

const POR_PAGINA = 9;

// Los filtros viven en la URL (?q=buzo&categoria=Ropa&talle=M...) para poder compartir la búsqueda
const leerFiltros = (sp) => ({
  q: sp.get('q') ?? '',
  categoria: sp.getAll('categoria'),
  talle: sp.getAll('talle'),
  color: sp.getAll('color'),
  min: sp.get('min') ?? '',
  max: sp.get('max') ?? '',
  stock: sp.get('stock') === '1',
  orden: sp.get('orden') ?? 'relevancia',
  page: Math.max(Number(sp.get('page')) || 1, 1),
});

const filtrarProductos = (productos, f) =>
  productos.filter((p) => {
    const variantes = p.variantes ?? [];
    if (!coincideBusqueda(p, f.q)) return false;
    if (f.categoria.length && !f.categoria.includes(getCategoriaNombre(p))) return false;
    if (f.talle.length && !variantes.some((v) => f.talle.includes(v.talle))) return false;
    if (f.color.length && !variantes.some((v) => f.color.includes(v.color))) return false;
    if (f.min && p.precio < Number(f.min)) return false;
    if (f.max && p.precio > Number(f.max)) return false;
    if (f.stock && getStockTotal(p) === 0) return false;
    return true;
  });

const ORDENES = {
  nuevos: (a, b) => b.id - a.id,
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
};

// Las categorías salen de GET /api/categorias; la cantidad se cuenta sobre los productos
const armarOpciones = (productos, categorias) => {
  const talles = new Set();
  const colores = new Set();
  productos.forEach((p) =>
    (p.variantes ?? []).forEach((v) => {
      talles.add(v.talle);
      colores.add(v.color);
    })
  );
  const precios = productos.map((p) => p.precio);
  return {
    categorias: categorias.map((cat) => ({
      nombre: cat.nombre,
      cantidad: productos.filter((p) => getCategoriaNombre(p) === cat.nombre).length,
    })),
    talles: [...talles].sort(compararTalles),
    colores: [...colores].map((nombre) => ({ nombre, hex: getColorHex(nombre) })),
    precio: { min: Math.min(...precios), max: Math.max(...precios) },
  };
};

const tituloPagina = (f) => {
  if (f.q) return `Resultados para “${f.q}”`;
  if (f.categoria.length === 1) return f.categoria[0] === 'Ropa' ? 'Indumentaria' : f.categoria[0];
  if (f.orden === 'nuevos') return 'Nuevos ingresos';
  return 'Todos los productos';
};

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const { data: productos, error: errorProductos, cargando: cargandoProductos } = useRequest(getProductos);
  const { data: categorias, error: errorCategorias, cargando: cargandoCategorias } = useRequest(getCategorias);
  const cargando = cargandoProductos || cargandoCategorias;
  const error = errorProductos || errorCategorias;
  const filtros = leerFiltros(searchParams);

  const opciones = useMemo(
    () => (productos && categorias ? armarOpciones(productos, categorias) : null),
    [productos, categorias]
  );
  const nuevosIds = useMemo(() => (productos ? getNuevosIds(productos) : new Set()), [productos]);

  // Cualquier cambio de filtro vuelve a la página 1
  const actualizar = (cambiar, { mantenerPagina = false } = {}) => {
    const next = new URLSearchParams(searchParams);
    cambiar(next);
    if (!mantenerPagina) next.delete('page');
    setSearchParams(next);
  };

  const toggle = (clave, valor) =>
    actualizar((next) => {
      const actuales = next.getAll(clave);
      next.delete(clave);
      const nuevos = actuales.includes(valor) ? actuales.filter((v) => v !== valor) : [...actuales, valor];
      nuevos.forEach((v) => next.append(clave, v));
    });

  const quitar = (clave, valor) => {
    if (['categoria', 'talle', 'color'].includes(clave)) toggle(clave, valor);
    else actualizar((next) => next.delete(clave));
  };

  const limpiar = () => actualizar((next) => ['categoria', 'talle', 'color', 'min', 'max', 'stock', 'q'].forEach((k) => next.delete(k)));

  if (cargando) {
    return <p className="container catalog__status">Cargando catálogo…</p>;
  }

  if (error) {
    return (
      <div className="container">
        <EmptyState title="No pudimos cargar el catálogo" text={error}>
          <Button onClick={() => window.location.reload()} variant="dark">
            Reintentar
          </Button>
        </EmptyState>
      </div>
    );
  }

  const resultado = filtrarProductos(productos, filtros);
  if (ORDENES[filtros.orden]) resultado.sort(ORDENES[filtros.orden]);
  const totalPaginas = Math.max(Math.ceil(resultado.length / POR_PAGINA), 1);
  const pagina = Math.min(filtros.page, totalPaginas);
  const desde = (pagina - 1) * POR_PAGINA;
  const visibles = resultado.slice(desde, desde + POR_PAGINA);

  const chips = [
    filtros.q && { key: 'q', value: filtros.q, label: `“${filtros.q}”` },
    ...filtros.categoria.map((v) => ({ key: 'categoria', value: v, label: v })),
    ...filtros.talle.map((v) => ({ key: 'talle', value: v, label: `Talle ${v}` })),
    ...filtros.color.map((v) => ({ key: 'color', value: v, label: v })),
    filtros.min && { key: 'min', value: filtros.min, label: `Desde ${formatPrice(filtros.min)}` },
    filtros.max && { key: 'max', value: filtros.max, label: `Hasta ${formatPrice(filtros.max)}` },
    filtros.stock && { key: 'stock', value: '1', label: 'En stock' },
  ].filter(Boolean);

  const titulo = tituloPagina(filtros);

  return (
    <div className="container catalog">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Productos', to: '/productos' }, ...(filtros.q || filtros.categoria.length === 1 ? [{ label: titulo }] : [])]} />

      <div className="catalog__header">
        <SectionHeader
          as="h1"
          size="lg"
          eyebrow="Encontrá tu próximo uniforme"
          title={titulo}
          subtitle={`${resultado.length} ${resultado.length === 1 ? 'producto' : 'productos'}`}
        />
        <div className="catalog__header-actions">
          <Button
            variant="ghost"
            size="sm"
            className="catalog__filters-btn"
            icon={<IconFilter size={14} />}
            onClick={() => setFiltrosAbiertos((v) => !v)}
            aria-expanded={filtrosAbiertos}
          >
            Filtrar
          </Button>
          <SortSelect value={filtros.orden} onChange={(orden) => actualizar((next) => next.set('orden', orden))} />
        </div>
      </div>

      <div className="catalog__layout">
        <div className={`catalog__sidebar ${filtrosAbiertos ? 'catalog__sidebar--open' : ''}`}>
          <FilterSidebar
            opciones={opciones}
            filtros={filtros}
            onToggle={toggle}
            onPrecio={(min, max) =>
              actualizar((next) => {
                if (min) next.set('min', min);
                else next.delete('min');
                if (max) next.set('max', max);
                else next.delete('max');
              })
            }
            onStock={(activo) => actualizar((next) => (activo ? next.set('stock', '1') : next.delete('stock')))}
            onClear={limpiar}
          />
        </div>

        <section className="catalog__results">
          <div className="catalog__toolbar">
            <ActiveFilters chips={chips} onRemove={quitar} onClear={limpiar} />
            {resultado.length > 0 && (
              <p className="catalog__count">
                Mostrando {desde + 1}–{desde + visibles.length} de {resultado.length}
              </p>
            )}
          </div>

          {visibles.length > 0 ? (
            <>
              <ProductGrid productos={visibles} columnas={3} nuevosIds={nuevosIds} />
              <Pagination
                page={pagina}
                totalPages={totalPaginas}
                onChange={(n) => {
                  actualizar((next) => next.set('page', n), { mantenerPagina: true });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          ) : (
            <EmptyState
              icon={<IconSearch size={24} />}
              title="Nada por acá."
              text="No encontramos productos con esos filtros. Probá con otra búsqueda o limpiá los filtros."
            >
              <Button variant="dark" onClick={limpiar}>
                Limpiar filtros
              </Button>
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductList;
