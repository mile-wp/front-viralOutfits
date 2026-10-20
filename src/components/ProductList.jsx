import React, { useEffect, useState } from 'react';
import CardProductos from './CardProductos';
import './ProductList.css';

const ProductList = ({ onSelectProduct }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Intenta traer de la API; si no está corriendo, carga el mock data local
    fetch('http://localhost:8080/api/productos')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo conectar a la API');
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch(() => {
        import('../data/products.json')
          .then((modulo) => {
            setProductos(modulo.default || modulo);
            setCargando(false);
          })
          .catch((err) => {
            setError(err.message);
            setCargando(false);
          });
      });
  }, []);

  if (cargando) {
    return <div className="product-list-container"><p style={{ textAlign: 'center', padding: '40px' }}>Cargando catálogo...</p></div>;
  }

  if (error) {
    return <div className="product-list-container"><p style={{ textAlign: 'center', color: '#e53935' }}>Error: {error}</p></div>;
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Nuestros Outfits</h2>
      <div className="products-grid">
        {productos.map((producto) => (
          <CardProductos 
            key={producto.id} 
            product={producto} 
            onSelectProduct={onSelectProduct} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;