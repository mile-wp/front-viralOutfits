import React, { useEffect, useState } from 'react';
import CardProductos from './CardProductos';
import './ProductList.css';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // LLAMADA AL BACKEND:
    // Asegurate de poner la ruta completa '/api/productos'
    fetch('http://localhost:8080/api/productos')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: no se pudo cargar el catálogo`);
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al conectar con el backend:', err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="product-list-container">
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
          Cargando productos desde el servidor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <p style={{ textAlign: 'center', color: '#e53935', fontSize: '1.1rem', marginTop: '2rem' }}>
          No se pudieron cargar los productos: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Nuestros Productos</h2>
      {productos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No hay productos cargados en la base de datos todavía.
        </p>
      ) : (
        <div className="products-grid">
          {productos.map((producto) => (
            <CardProductos key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;