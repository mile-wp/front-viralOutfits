// Estados de EstadoPedido del back: PENDIENTE, PAGADO, PREPARANDO, ENVIADO, ENTREGADO, CANCELADO

export const ESTADOS_PEDIDO = {
  PENDIENTE: { label: 'Pendiente de pago', tono: 'neutral' },
  PAGADO: { label: 'Confirmado', tono: 'neutral' },
  PREPARANDO: { label: 'En preparación', tono: 'alert' },
  ENVIADO: { label: 'En camino', tono: 'alert' },
  ENTREGADO: { label: 'Entregado', tono: 'success' },
  CANCELADO: { label: 'Cancelado', tono: 'muted' },
};

// Pasos que se muestran en el seguimiento del envío
export const PASOS_ENVIO = [
  { estado: 'PAGADO', label: 'Confirmado' },
  { estado: 'PREPARANDO', label: 'Preparado' },
  { estado: 'ENVIADO', label: 'En camino' },
  { estado: 'ENTREGADO', label: 'Entregado' },
];

export const getIndicePaso = (estado) => PASOS_ENVIO.findIndex((p) => p.estado === estado);

export const estaEnCurso = (estado) => ['PAGADO', 'PREPARANDO', 'ENVIADO'].includes(estado);
