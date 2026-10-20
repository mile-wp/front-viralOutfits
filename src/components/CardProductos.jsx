import React from 'react';
import './CardProductos.css';

const CardProductos = ({ product, onSelectProduct }) => {
  const categoriaTexto = product.categoria?.nombre || product.categoria || 'Indumentaria';

  // Si viene del backend calcula stock total de las variantes; si no, usa el stock directo
  const stockTotal = product.variantes
    ? product.variantes.reduce((acc, v) => acc + v.stock, 0)
    : (product.stock ?? 0);

  const imagenUrl = product.imagen || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80';

  const handleClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product.id);
    }
  };

  return (
    <div className="card-producto" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="producto-imagen-container">
        <img src={imagenUrl} alt={product.nombre} className="producto-imagen" />
        <span className="producto-categoria">{categoriaTexto}</span>
      </div>

      <div className="producto-info">
        <h3 className="producto-nombre">{product.nombre}</h3>
        <p className="producto-descripcion">{product.descripcion}</p>

        <div className="producto-stock">
          <span className={stockTotal > 0 ? 'en-stock' : 'sin-stock'}>
            {stockTotal > 0 ? `Stock: ${stockTotal}` : 'Agotado'}
          </span>
        </div>

        <div className="producto-footer">
          <span className="producto-precio">${product.precio?.toLocaleString('es-AR')}</span>
          <button 
            type="button"
            className="btn-agregar" 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Ver detalle ↗
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProductos;