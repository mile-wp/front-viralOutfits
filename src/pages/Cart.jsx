import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { IconArrowLeft, IconBag } from '../components/ui/Icons';
import CheckoutSection from '../components/cart/CheckoutSection';
import CartItem from '../components/cart/CartItem';
import ContactForm from '../components/cart/ContactForm';
import ShippingForm from '../components/cart/ShippingForm';
import PaymentForm from '../components/cart/PaymentForm';
import OrderSummary from '../components/cart/OrderSummary';
import { useCart } from '../hooks/useCart';
import { crearPedido } from '../services/pedidoService';
import { armarDireccionEnvio, calcularTotales, COSTO_ENVIO, METODOS_PAGO } from '../utils/checkout';
import { limpiarErrores, requerido, validarEmail, validarTexto } from '../utils/validation';
import './Cart.css';

const FORM_ID = 'checkout-form';

const FORM_INICIAL = {
  email: '',
  nombre: '',
  apellido: '',
  telefono: '',
  dni: '',
  entrega: 'domicilio',
  calle: '',
  numero: '',
  pisoDepto: '',
  codigoPostal: '',
  localidad: '',
  provincia: 'CABA',
  metodoPago: 'tarjeta',
  tarjetaNumero: '',
  tarjetaNombre: '',
  tarjetaVencimiento: '',
  tarjetaCvv: '',
  cuotas: '1',
};

const validarCheckout = (f) => {
  const domicilio = f.entrega === 'domicilio';
  const tarjeta = f.metodoPago === 'tarjeta';
  return limpiarErrores({
    email: validarEmail(f.email),
    nombre: validarTexto(f.nombre, 'nombre'),
    apellido: validarTexto(f.apellido, 'apellido'),
    telefono: requerido(f.telefono, 'Ingresá un teléfono de contacto'),
    dni: !/^\d{7,8}$/.test(f.dni.trim()) ? 'Ingresá un DNI válido (7 u 8 números)' : null,
    calle: domicilio ? validarTexto(f.calle, 'calle') : null,
    numero: domicilio ? requerido(f.numero) : null,
    codigoPostal: domicilio && !/^\d{4}$/.test(f.codigoPostal.trim()) ? 'Código postal de 4 números' : null,
    localidad: domicilio ? validarTexto(f.localidad, 'localidad') : null,
    tarjetaNumero: tarjeta && !/^\d{15,16}$/.test(f.tarjetaNumero.replace(/\s/g, '')) ? 'Número de tarjeta inválido' : null,
    tarjetaNombre: tarjeta ? requerido(f.tarjetaNombre) : null,
    tarjetaVencimiento: tarjeta && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.tarjetaVencimiento.trim()) ? 'Usá el formato MM/AA' : null,
    tarjetaCvv: tarjeta && !/^\d{3,4}$/.test(f.tarjetaCvv.trim()) ? 'CVV inválido' : null,
  });
};

const Cart = () => {
  const navigate = useNavigate();
  const { items, cantidadTotal, subtotal, actualizarCantidad, quitar, vaciar } = useCart();
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [cupon, setCupon] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);

  const totales = calcularTotales({ subtotal, metodoPago: form.metodoPago, entrega: form.entrega, cupon });
  const costoDomicilio = totales.faltaParaEnvioGratis > 0 ? COSTO_ENVIO : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrores((err) => ({ ...err, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarCheckout(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrorEnvio('Revisá los campos marcados en rojo.');
      return;
    }

    setErrorEnvio(null);
    setEnviando(true);
    try {
      // Lo que viaja al back: PedidoRequestDTO { metodoPago, direccionEnvio }
      const pedido = await crearPedido({
        metodoPago: METODOS_PAGO[form.metodoPago],
        direccionEnvio: armarDireccionEnvio(form),
      });
      vaciar();
      navigate('/mi-cuenta', { state: { pedidoCreado: pedido.id } });
    } catch (err) {
      setErrorEnvio(err.message);
      setEnviando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <EmptyState
          icon={<IconBag size={26} />}
          title="Tu bolsa está vacía."
          text="Todavía no agregaste nada. Date una vuelta por el catálogo y armá tu próximo uniforme."
        >
          <Button to="/productos" arrow>
            Ver productos
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container cart">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Carrito y checkout' }]} />

      <SectionHeader
        as="h1"
        size="lg"
        eyebrow="Último paso"
        title="Hacelo tuyo."
        action={
          <Link to="/productos" className="link cart__back">
            <IconArrowLeft size={12} /> Seguir comprando
          </Link>
        }
      />

      <div className="cart__layout">
        <form id={FORM_ID} className="cart__steps" onSubmit={handleSubmit} noValidate>
          <CheckoutSection
            numero={1}
            titulo={`Tu bolsa (${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'})`}
            accion={
              <button type="button" className="link" onClick={vaciar}>
                Vaciar bolsa
              </button>
            }
          >
            <ul className="cart-list">
              {items.map((item) => (
                <CartItem key={item.varianteProductoId} item={item} onCantidad={actualizarCantidad} onQuitar={quitar} />
              ))}
            </ul>
          </CheckoutSection>

          <CheckoutSection
            numero={2}
            titulo="Tus datos"
            accion={
              <span className="muted">
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" className="link">
                  Iniciá sesión
                </Link>
              </span>
            }
          >
            <ContactForm values={form} errors={errores} onChange={handleChange} />
          </CheckoutSection>

          <CheckoutSection numero={3} titulo="¿Dónde lo recibís?">
            <ShippingForm values={form} errors={errores} onChange={handleChange} envio={costoDomicilio} />
          </CheckoutSection>

          <CheckoutSection numero={4} titulo="Elegí cómo pagar">
            <PaymentForm values={form} errors={errores} onChange={handleChange} total={totales.total} />
          </CheckoutSection>

          {errorEnvio && (
            <p className="cart__error" role="alert">
              {errorEnvio}
            </p>
          )}
        </form>

        <OrderSummary
          totales={totales}
          cantidad={cantidadTotal}
          cupon={cupon}
          onCupon={setCupon}
          formId={FORM_ID}
          enviando={enviando}
        />
      </div>
    </div>
  );
};

export default Cart;
