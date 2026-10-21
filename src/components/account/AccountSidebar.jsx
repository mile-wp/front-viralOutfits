import { Link } from 'react-router-dom';
import { IconArrowUpRight, IconLogout, IconMapPin, IconPackage, IconUser } from '../ui/Icons';
import { getIniciales } from '../../utils/format';
import './Account.css';

const SECCIONES = [
  { id: 'pedidos', label: 'Mis pedidos', icon: <IconPackage size={16} /> },
  { id: 'datos', label: 'Mis datos', icon: <IconUser size={16} /> },
  { id: 'direcciones', label: 'Mis direcciones', icon: <IconMapPin size={16} /> },
];

// usuario: UsuarioResponseDTO { nombre, apellido, email, rol, ... }
const AccountSidebar = ({ usuario, seccion, onSeccion, cantidadPedidos }) => (
  <aside className="account-sidebar">
    <div className="account-user">
      <span className="account-user__avatar">{getIniciales(usuario.nombre, usuario.apellido)}</span>
      <div className="account-user__info">
        <p className="account-user__name">
          {usuario.nombre} {usuario.apellido}
        </p>
        <p className="account-user__email">{usuario.email}</p>
      </div>
    </div>

    <nav aria-label="Mi cuenta">
      <ul className="account-menu">
        {SECCIONES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`account-menu__item ${seccion === s.id ? 'account-menu__item--active' : ''}`}
              onClick={() => onSeccion(s.id)}
              aria-current={seccion === s.id ? 'page' : undefined}
            >
              {s.icon}
              {s.label}
              {s.id === 'pedidos' && <span className="account-menu__count">{String(cantidadPedidos).padStart(2, '0')}</span>}
            </button>
          </li>
        ))}
        <li>
          <Link to="/login" className="account-menu__item">
            <IconLogout size={16} />
            Cerrar sesión
          </Link>
        </li>
      </ul>
    </nav>

    <div className="account-help">
      <p className="account-help__title">¿Necesitás una mano?</p>
      <a href="https://wa.me/5491155550123" target="_blank" rel="noreferrer" className="link">
        Escribinos por WhatsApp <IconArrowUpRight size={11} />
      </a>
      <p className="account-help__text">Lunes a viernes de 10 a 18 h.</p>
    </div>
  </aside>
);

export default AccountSidebar;
