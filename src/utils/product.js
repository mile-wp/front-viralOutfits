import { IMAGENES_PRODUCTOS } from '../data/productImages';

// Helpers sobre ProductoResponseDTO:
// { id, nombre, descripcion, precio, marca, categoria: { id, nombre, descripcion }, variantes: [{ id, talle, color, stock }] }
// Las fotos no vienen en el DTO: se buscan por id en src/data/productImages.js.

export const DESCUENTO_TRANSFERENCIA = 0.1;
export const CUOTAS_SIN_INTERES = 3;
export const STOCK_BAJO = 5;

export const IMAGEN_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#f4f4f4"/><text x="200" y="258" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#a3a3a3">ViralOutfits®</text></svg>'
  );

export const getImagenes = (producto) => {
  const imagenes = IMAGENES_PRODUCTOS[producto?.id];
  return imagenes?.length ? imagenes : [IMAGEN_FALLBACK];
};

export const getImagenPrincipal = (producto) => getImagenes(producto)[0];

// La categoría llega como objeto desde el back; se tolera string por compatibilidad.
export const getCategoriaNombre = (producto) =>
  producto?.categoria?.nombre || producto?.categoria || 'Indumentaria';

export const getStockTotal = (producto) =>
  (producto?.variantes ?? []).reduce((acc, v) => acc + v.stock, 0);

const COLORES_HEX = {
  negro: '#111111',
  blanco: '#ffffff',
  gris: '#8d8d8d',
  crudo: '#ece6d9',
  arena: '#cbb89a',
  verde: '#5d7a5f',
  oliva: '#6b6b3f',
  azul: '#2f4a6d',
  'azul marino': '#1f2a44',
  khaki: '#b9a27a',
  cobre: '#b36a45',
  rojo: '#c62828',
  trigo: '#c8954d',
};

export const getColorHex = (color = '') => COLORES_HEX[color.toLowerCase()] ?? '#cccccc';

const ORDEN_TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Único'];

export const compararTalles = (a, b) => {
  const ia = ORDEN_TALLES.indexOf(a);
  const ib = ORDEN_TALLES.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  return String(a).localeCompare(String(b), 'es', { numeric: true });
};

// Colores únicos del producto; disponible = alguna variante de ese color tiene stock
export const getColores = (producto) => {
  const colores = new Map();
  (producto?.variantes ?? []).forEach((v) => {
    const actual = colores.get(v.color);
    colores.set(v.color, {
      nombre: v.color,
      hex: getColorHex(v.color),
      disponible: (actual?.disponible ?? false) || v.stock > 0,
    });
  });
  return [...colores.values()];
};

// Talles del producto (filtrados por color si se indica), ordenados de menor a mayor
export const getTalles = (producto, color) => {
  const talles = new Map();
  (producto?.variantes ?? [])
    .filter((v) => !color || v.color === color)
    .forEach((v) => {
      const actual = talles.get(v.talle);
      talles.set(v.talle, { talle: v.talle, disponible: (actual?.disponible ?? false) || v.stock > 0 });
    });
  return [...talles.values()].sort((a, b) => compararTalles(a.talle, b.talle));
};

export const findVariante = (producto, color, talle) =>
  (producto?.variantes ?? []).find((v) => v.color === color && v.talle === talle);

export const precioTransferencia = (precio) => precio * (1 - DESCUENTO_TRANSFERENCIA);

export const precioCuota = (precio) => precio / CUOTAS_SIN_INTERES;

// Los "nuevos" son los últimos productos cargados (id más alto)
export const getNuevosIds = (productos, cantidad = 4) =>
  new Set([...productos].sort((a, b) => b.id - a.id).slice(0, cantidad).map((p) => p.id));

export const getBadge = (producto, esNuevo = false) => {
  const stock = getStockTotal(producto);
  if (stock === 0) return { texto: 'Agotado', variante: 'muted' };
  if (stock <= STOCK_BAJO) return { texto: 'Últimas unidades', variante: 'red' };
  if (esNuevo) return { texto: 'Nuevo', variante: 'dark' };
  return null;
};

export const normalizar = (texto = '') =>
  texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export const coincideBusqueda = (producto, busqueda) => {
  if (!busqueda) return true;
  const campos = [producto.nombre, producto.descripcion, producto.marca, getCategoriaNombre(producto)];
  return normalizar(campos.join(' ')).includes(normalizar(busqueda));
};

export const findProductoPorVariante = (productos, varianteId) =>
  productos.find((p) => p.variantes?.some((v) => v.id === varianteId));
