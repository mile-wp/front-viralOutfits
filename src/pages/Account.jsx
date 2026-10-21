import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { IconArrowUpRight, IconCheck, IconMapPin, IconPackage } from '../components/ui/Icons';
import AccountSidebar from '../components/account/AccountSidebar';
import StatCard from '../components/account/StatCard';
import OrderCard from '../components/account/OrderCard';
import ProfileForm from '../components/account/ProfileForm';
import { useRequest } from '../hooks/useRequest';
import { useCart } from '../hooks/useCart';
import { getUsuarioActual } from '../services/usuarioService';
import { getMisPedidos } from '../services/pedidoService';
import { getProductos } from '../services/productService';
import { formatOrderId, formatPrice } from '../utils/format';
import { estaEnCurso } from '../utils/pedido';
import { findProductoPorVariante, getImagenPrincipal } from '../utils/product';
import './Account.css';

const FILTROS = [
  { value: 'todos', label: 'Todos los pedidos' },
  { value: 'en-curso', label: 'En curso' },
  { value: 'entregados', label: 'Entregados' },
  { value: 'cancelados', label: 'Cancelados' },
];

const pasaFiltro = (pedido, filtro) => {
  if (filtro === 'en-curso') return estaEnCurso(pedido.estadoPedido) || pedido.estadoPedido === 'PENDIENTE';
  if (filtro === 'entregados') return pedido.estadoPedido === 'ENTREGADO';
  if (filtro === 'cancelados') return pedido.estadoPedido === 'CANCELADO';
  return true;
};

const TITULOS = { pedidos: 'Mis pedidos', datos: 'Mis datos', direcciones: 'Mis direcciones' };

const Account = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { agregar } = useCart();
  const [seccion, setSeccion] = useState('pedidos');
  const [filtro, setFiltro] = useState('todos');

  const { data: usuario, cargando: cargandoUsuario } = useRequest(getUsuarioActual);
  const { data: pedidos, cargando: cargandoPedidos } = useRequest(getMisPedidos);
  const { data: productos } = useRequest(getProductos);

  if (cargandoUsuario || cargandoPedidos) {
    return <p className="container account-page__status">Cargando tu cuenta…</p>;
  }

  const lista = [...(pedidos ?? [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const visibles = lista.filter((p) => pasaFiltro(p, filtro));
  const enCamino = lista.filter((p) => estaEnCurso(p.estadoPedido)).length;
  const totalCompras = lista.filter((p) => p.estadoPedido !== 'CANCELADO').reduce((acc, p) => acc + p.total, 0);
  const direcciones = [...new Set(lista.map((p) => p.direccionEnvio))];

  const getImagen = (varianteId) => {
    const producto = findProductoPorVariante(productos ?? [], varianteId);
    return producto ? getImagenPrincipal(producto) : undefined;
  };

  // Vuelve a cargar al carrito las mismas variantes del pedido
  const repetirPedido = (pedido) => {
    pedido.items.forEach((item) => {
      const producto = findProductoPorVariante(productos ?? [], item.varianteProductoId);
      const variante = producto?.variantes.find((v) => v.id === item.varianteProductoId);
      if (!producto || !variante || variante.stock === 0) return;
      agregar(
        {
          varianteProductoId: variante.id,
          productoId: producto.id,
          nombreProducto: producto.nombre,
          talle: variante.talle,
          color: variante.color,
          precioUnitario: producto.precio,
          imagen: getImagenPrincipal(producto),
          stock: variante.stock,
        },
        Math.min(item.cantidad, variante.stock)
      );
    });
    navigate('/carrito');
  };

  return (
    <div className="container account-page">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mi cuenta', to: '/mi-cuenta' }, { label: TITULOS[seccion] }]} />

      <SectionHeader
        as="h1"
        size="lg"
        eyebrow="Tu espacio en ViralOutfits"
        title={`Hola, ${usuario.nombre}.`}
        action={
          <Link to="/productos?orden=nuevos" className="link account-page__cta">
            Ver lo nuevo <IconArrowUpRight size={11} />
          </Link>
        }
      />

      {state?.pedidoCreado && (
        <p className="account-page__success" role="status">
          <IconCheck size={16} /> ¡Gracias por tu compra! Registramos tu pedido {formatOrderId(state.pedidoCreado)} y te
          enviamos el detalle por email.
        </p>
      )}

      <div className="account-page__layout">
        <AccountSidebar usuario={usuario} seccion={seccion} onSeccion={setSeccion} cantidadPedidos={lista.length} />

        <div className="account-page__main">
          {seccion === 'pedidos' && (
            <>
              <div className="stats">
                <StatCard label="Pedidos realizados" value={String(lista.length).padStart(2, '0')} />
                <StatCard label="En camino" value={String(enCamino).padStart(2, '0')} />
                <StatCard label="Total en compras" value={formatPrice(totalCompras)} />
              </div>

              <div className="account-page__bar">
                <h2 className="account-page__title">Mis pedidos</h2>
                <Select
                  aria-label="Filtrar pedidos"
                  size="sm"
                  options={FILTROS}
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>

              {visibles.length > 0 ? (
                <div className="account-page__orders">
                  {visibles.map((pedido, i) => (
                    <OrderCard
                      key={pedido.id}
                      pedido={pedido}
                      getImagen={getImagen}
                      onRepetir={repetirPedido}
                      defaultOpen={i === 0 && estaEnCurso(pedido.estadoPedido)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<IconPackage size={24} />} title="Sin pedidos por acá." text="No hay pedidos que coincidan con el filtro.">
                  <Button to="/productos" arrow>
                    Ir a comprar
                  </Button>
                </EmptyState>
              )}
            </>
          )}

          {seccion === 'datos' && (
            <>
              <h2 className="account-page__title">Mis datos</h2>
              <ProfileForm usuario={usuario} />
            </>
          )}

          {seccion === 'direcciones' && (
            <>
              <h2 className="account-page__title">Mis direcciones</h2>
              <ul className="address-list">
                {direcciones.map((dir) => (
                  <li key={dir} className="address-card">
                    <IconMapPin size={16} />
                    <span>{dir}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
