// Formateadores de presentación (moneda, fechas, ids)

export const formatPrice = (valor) =>
  `$${Math.round(valor ?? 0).toLocaleString('es-AR')}`;

export const formatDate = (iso, opciones = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(iso).toLocaleDateString('es-AR', opciones);

export const formatOrderId = (id) => `#VO-${String(id).padStart(5, '0')}`;

export const getIniciales = (nombre = '', apellido = '') =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
