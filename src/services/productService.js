import { getJson, USE_MOCK } from './api';

// GET /api/productos -> ProductoResponseDTO[]
export const getProductos = () => getJson('products.json', '/api/productos');

// GET /api/productos/{id} -> ProductoResponseDTO
export const getProductoById = async (id) => {
  if (!USE_MOCK) return getJson(null, `/api/productos/${id}`);
  const productos = await getProductos();
  const producto = productos.find((p) => p.id === Number(id));
  if (!producto) throw new Error('Producto no encontrado');
  return producto;
};
