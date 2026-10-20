
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

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de que querés eliminar este producto?'
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/productos/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto');
      }

      // Actualizamos la lista sin el producto eliminado
      setProducts((productosActuales) =>
        productosActuales.filter((producto) => producto.id !== id)
      );
    } catch (error) {
      alert(error.message);
    }
  };

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

      <p className="product-list-count">
        {products.length} productos encontrados
      </p>

      <div className="products-grid">
        {products.map((product) => (
          <CardProductos
            key={product.id}
            product={product}
            onEliminar={eliminarProducto}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;