import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { STORAGE_KEY } from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

let previousItems = store.getState().cart.items;

store.subscribe(() => {
  const items = store.getState().cart.items;
  if (items === previousItems) return;

  previousItems = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('No se pudo guardar el carrito en el almacenamiento local.', error);
  }
});
