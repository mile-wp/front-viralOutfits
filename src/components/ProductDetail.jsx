import React, { useState, useEffect } from 'react';
import './ProductDetail.css';

const ProductDetail = ({ productId, onBack, onAddToCart }) => {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para variantes seleccionadas
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    // Si no se provee un ID, usamos 1 por defecto
    const id = productId || 1;
    setCargando(true);

    // Intenta buscar en la API; si falla o no está levantada, busca en el JSON local
    fetch(`http://localhost:8080/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo obtener el producto del servidor');
        return res.json();
      })
      .then((data) => {
        cargarDatosProducto(data);
        setCargando(false);
      })
      .catch(() => {
        // Fallback local: importa o lee de data/products.json
        import('../data/products.json')
          .then((modulo) => {
            const lista = modulo.default || modulo;
            const encontrado = lista.find((p) => p.id === Number(id)) || lista[0];
            cargarDatosProducto(encontrado);
            setCargando(false);
          })
          .catch((err) => {
            setError('Error al cargar la información del producto.');
            setCargando(false);
          });
      });
  }, [productId]);

  const cargarDatosProducto = (prod) => {
    setProducto(prod);
    if (prod && prod.variantes && prod.variantes.length > 0) {
      // Preseleccionar el primer color y talle disponibles
      setColorSeleccionado(prod.variantes[0].color);
      setTalleSeleccionado(prod.variantes[0].talle);
    }
  };

  if (cargando) {
    return (
      <div className="product-detail-container">
        <p className="detail-status-msg">Cargando detalles de la prenda...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="product-detail-container">
        <p className="detail-status-msg error">{error || 'Producto no encontrado'}</p>
        <button className="btn-back" onClick={onBack}>← Volver al catálogo</button>
      </div>
    );
  }

  // Filtrado de variantes únicas según el contrato ProductoResponseDTO
  const variantes = producto.variantes || [];
  const coloresDisponibles = [...new Set(variantes.map((v) => v.color))];
  const tallesDisponibles = [...new Set(
    variantes
      .filter((v) => !colorSeleccionado || v.color === colorSeleccionado)
      .map((v) => v.talle)
  )];

  // Variante concreta actual para stock
  const varianteActual = variantes.find(
    (v) => v.color === colorSeleccionado && v.talle === talleSeleccionado
  );

  const stockDisponible = varianteActual ? varianteActual.stock : (producto.stock ?? 0);
  const sinStock = stockDisponible <= 0;

  const handleAgregar = () => {
    if (onAddToCart) {
      onAddToCart({
        productoId: producto.id,
        varianteId: varianteActual ? varianteActual.id : null,
        nombre: producto.nombre,
        color: colorSeleccionado,
        talle: talleSeleccionado,
        precio: producto.precio,
        cantidad: cantidad,
      });
    } else {
      alert(`Agregado al carrito: ${producto.nombre} (${colorSeleccionado} / ${talleSeleccionado}) x${cantidad}`);
    }
  };

  const imagenPrincipal = producto.imagen || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="product-detail-container">
      {/* Navegación y volver */}
      <nav className="detail-breadcrumb">
        <button onClick={onBack} className="breadcrumb-back-btn">
          ← Volver a la tienda
        </button>
        <span className="breadcrumb-separator">/</span>
        <span>{producto.categoria?.nombre || producto.categoria || 'Indumentaria'}</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{producto.nombre}</span>
      </nav>

      <div className="product-detail-layout">
        {/* Galería / Imagen Principal */}
        <div className="detail-gallery">
          <div className="main-image-wrapper">
            <img src={imagenPrincipal} alt={producto.nombre} className="detail-main-img" />
            <span className="badge-exclusive">VIRAL OUTFITS</span>
          </div>
        </div>

        {/* Información y Compra */}
        <div className="detail-info">
          {producto.marca && <span className="detail-brand">{producto.marca}</span>}
          <h1 className="detail-title">{producto.nombre}</h1>
          
          <div className="detail-price-box">
            <span className="detail-price">${producto.precio?.toLocaleString('es-AR')}</span>
            <span className="detail-installments">3 cuotas sin interés de ${(producto.precio / 3)?.toFixed(2)}</span>
          </div>

          <p className="detail-description">{producto.descripcion}</p>

          <hr className="detail-divider" />

          {/* Selector de Color */}
          {coloresDisponibles.length > 0 && (
            <div className="selector-group">
              <label className="selector-label">
                COLOR: <strong>{colorSeleccionado}</strong>
              </label>
              <div className="options-row">
                {coloresDisponibles.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`btn-option ${colorSeleccionado === color ? 'selected' : ''}`}
                    onClick={() => {
                      setColorSeleccionado(color);
                      // Ajustar talle si el actual no existe para este color
                      const tallesDeColor = variantes.filter((v) => v.color === color).map((v) => v.talle);
                      if (!tallesDeColor.includes(talleSeleccionado)) {
                        setTalleSeleccionado(tallesDeColor[0] || '');
                      }
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Talle */}
          {tallesDisponibles.length > 0 && (
            <div className="selector-group">
              <div className="selector-header-flex">
                <label className="selector-label">
                  TALLE: <strong>{talleSeleccionado}</strong>
                </label>
                <button type="button" className="btn-size-guide">Guía de talles ↗</button>
              </div>
              <div className="options-row">
                {tallesDisponibles.map((talle) => (
                  <button
                    key={talle}
                    type="button"
                    className={`btn-option size-btn ${talleSeleccionado === talle ? 'selected' : ''}`}
                    onClick={() => setTalleSeleccionado(talle)}
                  >
                    {talle}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock y Cantidad */}
          <div className="stock-quantity-row">
            <div className="quantity-counter">
              <button
                type="button"
                onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                disabled={sinStock || cantidad <= 1}
              >
                -
              </button>
              <span>{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((prev) => Math.min(stockDisponible, prev + 1))}
                disabled={sinStock || cantidad >= stockDisponible}
              >
                +
              </button>
            </div>

            <div className="stock-status">
              {sinStock ? (
                <span className="stock-out">Sin stock disponible</span>
              ) : (
                <span className="stock-in">✓ Stock disponible: {stockDisponible} unidades</span>
              )}
            </div>
          </div>

          {/* Botón de acción */}
          <button
            type="button"
            className="btn-add-cart"
            onClick={handleAgregar}
            disabled={sinStock}
          >
            {sinStock ? 'PRODUCTO AGOTADO' : 'AGREGAR AL CARRITO ↗'}
          </button>

          {/* Ventajas y Garantías */}
          <div className="detail-features">
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Envío gratis a todo el país en compras superiores a $150.000</span>
            </div>
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>30 días para cambios y devoluciones sin cargo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;