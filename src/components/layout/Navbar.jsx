import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import SearchBar from './SearchBar';
import { IconBag, IconClose, IconMenu, IconUser } from '../ui/Icons';
import './Navbar.css';

// Las categorías coinciden con las del back (Calzado, Ropa, Accesorios)
const LINKS = [
  { label: 'Nuevo', to: '/productos?orden=nuevos' },
  { label: 'Indumentaria', to: '/productos?categoria=Ropa' },
  { label: 'Calzado', to: '/productos?categoria=Calzado' },
  { label: 'Accesorios', to: '/productos?categoria=Accesorios' },
  { label: 'Sale', to: '/productos?orden=precio-asc', destacado: true },
];

const Navbar = () => {
  const { cantidadTotal } = useCart();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <button
          type="button"
          className="navbar__burger"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? <IconClose /> : <IconMenu />}
        </button>

        <Link to="/" className="navbar__logo" onClick={cerrarMenu}>
          ViralOutfits<sup>®</sup>
        </Link>

        <nav className={`navbar__nav ${menuAbierto ? 'navbar__nav--open' : ''}`} aria-label="Principal">
          <ul>
            {LINKS.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={`navbar__link ${link.destacado ? 'navbar__link--sale' : ''}`}
                  onClick={cerrarMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="navbar__search-mobile">
            <SearchBar onSearch={cerrarMenu} />
          </div>
        </nav>

        <div className="navbar__actions">
          <div className="navbar__search-desktop">
            <SearchBar />
          </div>
          <Link to="/mi-cuenta" className="navbar__icon" aria-label="Mi cuenta" onClick={cerrarMenu}>
            <IconUser />
          </Link>
          <Link to="/carrito" className="navbar__icon" aria-label={`Carrito, ${cantidadTotal} productos`} onClick={cerrarMenu}>
            <IconBag />
            {cantidadTotal > 0 && <span className="navbar__count">{cantidadTotal}</span>}
          </Link>
          <span className="navbar__lang">ES</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
