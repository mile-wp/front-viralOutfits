import CardProductos from './CardProductos';
import './ProductGrid.css';

// Grilla de tarjetas (4 o 3 columnas en desktop, 2 en mobile).
// `nuevosIds` (Set) marca qué productos llevan el badge "Nuevo".
const ProductGrid = ({ productos, columnas = 4, nuevosIds }) => (
  <div className={`product-grid product-grid--${columnas}`}>
    {productos.map((producto) => (
      <CardProductos key={producto.id} product={producto} esNuevo={nuevosIds?.has(producto.id)} />
    ))}
  </div>
);

export default ProductGrid;
