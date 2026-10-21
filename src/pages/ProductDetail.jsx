import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import QuantitySelector from '../components/ui/QuantitySelector';
import SectionHeader from '../components/ui/SectionHeader';
import Tabs from '../components/ui/Tabs';
import { IconArrowUpRight, IconCheck, IconRefresh, IconTruck } from '../components/ui/Icons';
import ProductGallery from '../components/product/ProductGallery';
import PriceBlock from '../components/product/PriceBlock';
import ColorSelector from '../components/product/ColorSelector';
import SizeSelector from '../components/product/SizeSelector';
import SizeGuideModal from '../components/product/SizeGuideModal';
import ShippingEstimator from '../components/product/ShippingEstimator';
import ProductGrid from '../components/product/ProductGrid';
import ServicesBar from '../components/home/ServicesBar';
import { useRequest } from '../hooks/useRequest';
import { useCart } from '../hooks/useCart';
import { getProductoById, getProductos } from '../services/productService';
import { formatPrice } from '../utils/format';
import { ENVIO_GRATIS_DESDE } from '../utils/checkout';
import {
  findVariante,
  getBadge,
  getCategoriaNombre,
  getColores,
  getImagenes,
  getTalles,
  STOCK_BAJO,
} from '../utils/product';
import './ProductDetail.css';

// Primera combinación color/talle con stock para preseleccionar
const seleccionInicial = (producto) => {
  const variante = producto.variantes?.find((v) => v.stock > 0) ?? producto.variantes?.[0];
  return { color: variante?.color ?? '', talle: variante?.talle ?? '' };
};

const DetalleProducto = ({ producto, relacionados }) => {
  const { agregar } = useCart();
  const inicial = seleccionInicial(producto);
  const [color, setColor] = useState(inicial.color);
  const [talle, setTalle] = useState(inicial.talle);
  const [cantidad, setCantidad] = useState(1);
  const [guiaAbierta, setGuiaAbierta] = useState(false);
  const [agregado, setAgregado] = useState(false);

  const categoria = getCategoriaNombre(producto);
  const colores = getColores(producto);
  const talles = getTalles(producto, color);
  const variante = findVariante(producto, color, talle);
  const stock = variante?.stock ?? 0;
  const sinStock = stock <= 0;

  const cambiarColor = (nuevoColor) => {
    setColor(nuevoColor);
    setCantidad(1);
    setAgregado(false);
    // Si el talle elegido no existe (o no tiene stock) en el nuevo color, se elige el primero disponible
    const disponibles = getTalles(producto, nuevoColor).filter((t) => t.disponible);
    if (!disponibles.some((t) => t.talle === talle)) setTalle(disponibles[0]?.talle ?? '');
  };

  const cambiarTalle = (nuevoTalle) => {
    setTalle(nuevoTalle);
    setCantidad(1);
    setAgregado(false);
  };

  const handleAgregar = () => {
    agregar(
      {
        varianteProductoId: variante.id,
        productoId: producto.id,
        nombreProducto: producto.nombre,
        talle,
        color,
        precioUnitario: producto.precio,
        imagen: getImagenes(producto)[0],
        stock,
      },
      cantidad
    );
    setAgregado(true);
  };

  const tabs = [
    {
      id: 'detalles',
      label: 'Detalles del producto',
      content: (
        <>
          <p>{producto.descripcion}</p>
          <ul className="detail__specs">
            <li>
              <strong>Marca:</strong> {producto.marca || 'ViralOutfits'}
            </li>
            <li>
              <strong>Categoría:</strong> {categoria}
            </li>
            <li>
              <strong>Colores:</strong> {colores.map((c) => c.nombre).join(', ')}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'envios',
      label: 'Envíos y cambios',
      content: (
        <p>
          Envío gratis a todo el país en compras desde {formatPrice(ENVIO_GRATIS_DESDE)}. Tenés 30 días para cambiar
          tu prenda sin cargo, siempre que esté sin uso y con su etiqueta.
        </p>
      ),
    },
  ];

  return (
    <>
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            { label: categoria, to: `/productos?categoria=${encodeURIComponent(categoria)}` },
            { label: producto.nombre },
          ]}
        />

        <div className="detail">
          <ProductGallery imagenes={getImagenes(producto)} nombre={producto.nombre} badge={getBadge(producto)} />

          <div className="detail__info">
            <div className="detail__heading">
              <span className="eyebrow">
                {categoria} · {producto.marca || 'ViralOutfits'}
              </span>
              <h1 className="detail__title display">{producto.nombre}</h1>
            </div>

            <PriceBlock precio={producto.precio} />

            {colores.length > 0 && <ColorSelector colores={colores} value={color} onChange={cambiarColor} />}
            {talles.length > 0 && (
              <SizeSelector talles={talles} value={talle} onChange={cambiarTalle} onOpenGuide={() => setGuiaAbierta(true)} />
            )}

            <p className={`detail__stock ${sinStock ? 'detail__stock--out' : stock <= STOCK_BAJO ? 'detail__stock--low' : ''}`}>
              {sinStock && 'Sin stock en esta combinación'}
              {!sinStock && stock <= STOCK_BAJO && `¡Últimas ${stock} ${stock === 1 ? 'unidad' : 'unidades'}!`}
              {!sinStock && stock > STOCK_BAJO && 'En stock · listo para enviar'}
            </p>

            <div className="detail__buy">
              <QuantitySelector
                value={cantidad}
                max={stock}
                disabled={sinStock}
                onChange={(n) => {
                  setCantidad(n);
                  setAgregado(false);
                }}
              />
              <Button size="lg" full arrow onClick={handleAgregar} disabled={sinStock || !variante}>
                {sinStock ? 'Producto agotado' : 'Agregar al carrito'}
              </Button>
            </div>

            {agregado && (
              <p className="detail__added" role="status">
                <IconCheck size={14} /> Agregado a tu bolsa.
                <Link to="/carrito" className="link">
                  Ver bolsa <IconArrowUpRight size={11} />
                </Link>
              </p>
            )}

            <ShippingEstimator precio={producto.precio * cantidad} />

            <ul className="detail__features">
              <li>
                <IconTruck size={16} /> Envío gratis desde {formatPrice(ENVIO_GRATIS_DESDE)}
              </li>
              <li>
                <IconRefresh size={16} /> 30 días para cambios sin cargo
              </li>
            </ul>
          </div>
        </div>

        <div className="detail__tabs">
          <Tabs tabs={tabs} />
        </div>

        {relacionados.length > 0 && (
          <section className="detail__related">
            <SectionHeader
              title="Completá el uniforme."
              action={
                <Link to="/productos" className="link detail__more">
                  Ver todo <IconArrowUpRight size={11} />
                </Link>
              }
            />
            <ProductGrid productos={relacionados} />
          </section>
        )}
      </div>

      <ServicesBar />
      <SizeGuideModal isOpen={guiaAbierta} onClose={() => setGuiaAbierta(false)} categoria={categoria} />
    </>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { data: producto, error, cargando } = useRequest(getProductoById, id);
  const { data: productos } = useRequest(getProductos);

  if (cargando) {
    return <p className="container detail__status">Cargando detalles de la prenda…</p>;
  }

  if (error || !producto) {
    return (
      <div className="container">
        <EmptyState title="No encontramos esta prenda" text="Puede que ya no esté disponible o que el link esté mal.">
          <Button to="/productos" variant="dark" arrow>
            Volver al catálogo
          </Button>
        </EmptyState>
      </div>
    );
  }

  // "Completá el uniforme": priorizamos productos de otras categorías para armar el look
  const relacionados = (productos ?? [])
    .filter((p) => p.id !== producto.id)
    .sort((a, b) => Number(getCategoriaNombre(a) === getCategoriaNombre(producto)) - Number(getCategoriaNombre(b) === getCategoriaNombre(producto)) || b.id - a.id)
    .slice(0, 4);

  // key: al pasar a otro producto se reinicia la selección de color/talle/cantidad
  return <DetalleProducto key={producto.id} producto={producto} relacionados={relacionados} />;
};

export default ProductDetail;
