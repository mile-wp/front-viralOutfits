import { DESCUENTO_TRANSFERENCIA } from './product';

export const ENVIO_GRATIS_DESDE = 150000;
export const COSTO_ENVIO = 6500;

export const CUPONES = {
  VIRAL10: 0.1,
};

export const METODOS_PAGO = {
  tarjeta: 'Tarjeta de crédito',
  transferencia: 'Transferencia bancaria',
  mercadopago: 'Mercado Pago',
};

export const SHOWROOM = 'Gorriti 4865, Palermo, CABA';

export const calcularTotales = ({ subtotal, metodoPago, entrega, cupon }) => {
  const descuentoTransferencia = metodoPago === 'transferencia' ? subtotal * DESCUENTO_TRANSFERENCIA : 0;
  const descuentoCupon = cupon ? subtotal * (CUPONES[cupon] ?? 0) : 0;
  const envioGratis = subtotal >= ENVIO_GRATIS_DESDE || entrega === 'retiro';
  const envio = subtotal === 0 || envioGratis ? 0 : COSTO_ENVIO;
  const descuento = descuentoTransferencia + descuentoCupon;

  return {
    subtotal,
    descuento,
    envio,
    total: Math.max(subtotal - descuento + envio, 0),
    faltaParaEnvioGratis: Math.max(ENVIO_GRATIS_DESDE - subtotal, 0),
  };
};

// Arma el string que espera PedidoRequestDTO.direccionEnvio
export const armarDireccionEnvio = (form) => {
  if (form.entrega === 'retiro') return `Retiro en showroom - ${SHOWROOM}`;
  const piso = form.pisoDepto ? `, ${form.pisoDepto}` : '';
  return `${form.calle} ${form.numero}${piso}, ${form.localidad}, ${form.provincia} (${form.codigoPostal})`;
};
