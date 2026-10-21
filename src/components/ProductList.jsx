import products from '../data/products.json';
import CardProductos from './CardProductos';
import './ProductList.css';

const ProductList = ({ onOpenCart, onAddToCart }) => {
  return (
    <div className="product-list-container">
      <header className="product-list-header">
        <h1 className="product-list-title">ViralOutfits</h1>
        <button className="product-list-cart" type="button" onClick={onOpenCart}>
          ♧ Carrito
        </button>
      </header>
      <h2 className="product-list-subtitle">Nuestros Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <CardProductos key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
