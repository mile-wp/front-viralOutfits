import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import './App.css';

function App() {
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);

  // Ir al detalle
  const handleVerDetalle = (id) => {
    setProductoSeleccionadoId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Volver al catálogo
  const handleVolver = () => {
    setProductoSeleccionadoId(null);
  };

  return (
    <div className="app-main-layout">
      {/* Header / Navbar público */}
      <header className="site-header">
        <div className="header-brand" onClick={handleVolver} style={{ cursor: 'pointer' }}>
          ViralOutfits®
        </div>
        <nav className="header-nav">
          <button className="nav-item-btn" onClick={handleVolver}>CATÁLOGO</button>
          <span className="nav-item">NUEVO</span>
          <span className="nav-item">INDUMENTARIA</span>
          <span className="nav-item">ACCESORIOS</span>
        </nav>
      </header>

      {/* Vista condicional */}
      <main className="site-content">
        {productoSeleccionadoId ? (
          <ProductDetail
            productId={productoSeleccionadoId}
            onBack={handleVolver}
            onAddToCart={(item) => {
              alert(`Agregado al carrito: ${item.nombre} (Talle: ${item.talle}, Color: ${item.color}) x${item.cantidad}`);
            }}
          />
        ) : (
          <ProductList onSelectProduct={handleVerDetalle} />
        )}
      </main>

      {/* Footer básico */}
      <footer className="site-footer">
        <p>© 2026 Viral Outfits - Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;