import { apiFetch, getJson, USE_MOCK } from './api';

// GET /api/pedidos/mis-pedidos -> PedidoResponseDTO[] (requiere token del usuario logueado)
export const getMisPedidos = (token) => getJson('orders.json', '/api/pedidos/mis-pedidos', { token });

// POST /api/pedidos con PedidoRequestDTO { metodoPago, direccionEnvio } -> PedidoResponseDTO
export const crearPedido = (pedido, token) =>
  USE_MOCK
    ? Promise.resolve({ id: Date.now() % 100000, estadoPedido: 'PENDIENTE', ...pedido })
    : apiFetch('/api/pedidos', { method: 'POST', body: pedido, token });
