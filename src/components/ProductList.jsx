import { useEffect, useState } from 'react';
import CardProductos from './CardProductos';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos');
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

 if (loading) {
  return (
    <p className="product-list-status">
      Cargando productos...
    </p>
  );
  }

if (error) {
  return (
    <p className="product-list-error">
      {error}
    </p>
  );
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">
        Nuestros productos
      </h2>

      <p className="product-list-count">{products.length} productos encontrados
      </p>

      <div className="products-grid">
        {products.map((product) => (
          <CardProductos
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;