import React from 'react';
import './CardProductos.css';

const CardProductos = ({ product }) => {
  // Maneja si viene categoria como objeto { nombre } desde el back o como string
  const categoriaTexto = product.categoria?.nombre || product.categoria || 'Indumentaria';

  // Suma el stock de todas las variantes si viene del backend
  const stockTotal = product.variantes
    ? product.variantes.reduce((total, v) => total + v.stock, 0)
    : (product.stock ?? 0);

  // Imagen fallback
  const imagenUrl = product.imagen || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80';

  return (
    <div className="card-producto">
      <div className="producto-imagen-container">
        <img
          src={imagenUrl}
          alt={product.nombre}
          className="producto-imagen"
        />
        <span className="producto-categoria">{categoriaTexto}</span>
      </div>

      <div className="producto-info">
        <h3 className="producto-nombre">{product.nombre}</h3>
        <p className="producto-descripcion">{product.descripcion}</p>

        {product.marca && (
          <small style={{ color: '#888', marginBottom: '0.5rem', display: 'block' }}>
            Marca: {product.marca}
          </small>
        )}

        <div className="producto-stock">
          <span className={stockTotal > 0 ? 'en-stock' : 'sin-stock'}>
            {stockTotal > 0 ? `Stock disponible: ${stockTotal}` : 'Agotado'}
          </span>
        </div>

        <div className="producto-footer">
          <span className="producto-precio">${product.precio}</span>
          <button className="btn-agregar" disabled={stockTotal === 0}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProductos;