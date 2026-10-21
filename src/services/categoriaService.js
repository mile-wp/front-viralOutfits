import { getJson } from './api';

// GET /api/categorias -> CategoriaResponseDTO[]
export const getCategorias = () => getJson('categories.json', '/api/categorias');
