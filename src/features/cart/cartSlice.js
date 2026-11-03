import { createSelector, createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'viralOutfits.carrito';

const cargarItemsIniciales = () => {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: cargarItemsIniciales() },
  reducers: {
    agregarItem(state, action) {
      const { item, cantidad = 1 } = action.payload;
      const existente = state.items.find((actual) => actual.varianteProductoId === item.varianteProductoId);

      if (existente) {
        existente.cantidad = Math.min(existente.cantidad + cantidad, existente.stock ?? Infinity);
        return;
      }

      state.items.push({ ...item, cantidad });
    },
    actualizarCantidad(state, action) {
      const { varianteProductoId, cantidad } = action.payload;
      const item = state.items.find((actual) => actual.varianteProductoId === varianteProductoId);

      if (item) item.cantidad = cantidad;
    },
    quitarItem(state, action) {
      state.items = state.items.filter((item) => item.varianteProductoId !== action.payload);
    },
    vaciarCarrito(state) {
      state.items = [];
    },
  },
});

export const { agregarItem, actualizarCantidad, quitarItem, vaciarCarrito } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.cantidad, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.precioUnitario * item.cantidad, 0)
);

export { STORAGE_KEY };
export default cartSlice.reducer;
