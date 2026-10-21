import { useEffect, useMemo, useReducer } from 'react';
import { CartContext } from './CartContext';

// Cada ítem replica CarritoItemResponseDTO del back
// { varianteProductoId, nombreProducto, talle, color, precioUnitario, cantidad }
// + datos de presentación: productoId, imagen, stock.

const STORAGE_KEY = 'viralOutfits.carrito';

const cargarInicial = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

function cartReducer(items, action) {
  switch (action.type) {
    case 'agregar': {
      const { item, cantidad } = action;
      const existente = items.find((i) => i.varianteProductoId === item.varianteProductoId);
      if (existente) {
        return items.map((i) =>
          i === existente ? { ...i, cantidad: Math.min(i.cantidad + cantidad, i.stock ?? Infinity) } : i
        );
      }
      return [...items, { ...item, cantidad }];
    }
    case 'actualizar':
      return items.map((i) =>
        i.varianteProductoId === action.varianteProductoId ? { ...i, cantidad: action.cantidad } : i
      );
    case 'quitar':
      return items.filter((i) => i.varianteProductoId !== action.varianteProductoId);
    case 'vaciar':
      return [];
    default:
      return items;
  }
}

export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, cargarInicial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Sin storage disponible el carrito vive solo en memoria
    }
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      cantidadTotal: items.reduce((acc, i) => acc + i.cantidad, 0),
      subtotal: items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0),
      agregar: (item, cantidad = 1) => dispatch({ type: 'agregar', item, cantidad }),
      actualizarCantidad: (varianteProductoId, cantidad) =>
        dispatch({ type: 'actualizar', varianteProductoId, cantidad }),
      quitar: (varianteProductoId) => dispatch({ type: 'quitar', varianteProductoId }),
      vaciar: () => dispatch({ type: 'vaciar' }),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
