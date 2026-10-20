import React from 'react';
import './CardProductos.css';

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const CardProductos = ({ product, onEliminar }) => {
  const variantes = product.variantes ?? [];

  const stockTotal = variantes.reduce(
    (total, variante) => total + (Number(variante.stock) || 0),
    0
  );

  return (
    <div className="card-producto">
      <div className="producto-imagen-container">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="producto-imagen"
        />

        <span className="producto-categoria">
          {product.categoria?.nombre ?? 'Sin categoría'}
        </span>
      </div>

      <div className="producto-info">
        <h3 className="producto-nombre">
          {product.nombre}
        </h3>

        <p className="producto-descripcion">
          {product.descripcion}
        </p>

        {product.marca && (
          <p className="producto-marca">
            Marca: {product.marca}
          </p>
        )}

        <div className="producto-rating">
          <span className="stars">
            ⭐ {product.rating ?? 'Sin valoración'}
          </span>
        </div>

        <div className="producto-variantes">
          <h4>Talles y colores</h4>

          {variantes.length > 0 ? (
            <ul>
              {variantes.map((variante) => (
                <li key={variante.id}>
                  Talle: {variante.talle} · Color: {variante.color} ·
                  Stock: {variante.stock}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay variantes disponibles.</p>
          )}
        </div>

        <div className="producto-stock">
          <span
            className={
              stockTotal > 0 ? 'en-stock' : 'sin-stock'
            }
          >
            {stockTotal > 0
              ? `Stock total: ${stockTotal}`
              : 'Agotado'}
          </span>
        </div>

        <div className="producto-footer">
          <span className="producto-precio">
            {formatoPrecio.format(product.precio ?? 0)}
          </span>

          <button
            className="btn-agregar"
            type="button"
            disabled={stockTotal === 0}
          >
            Agregar
          </button>

          <button
            className="btn-eliminar"
            type="button"
            onClick={() => onEliminar(product.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProductos;
