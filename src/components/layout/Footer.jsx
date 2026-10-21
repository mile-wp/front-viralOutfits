import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';
import { IconArrowUpRight } from '../ui/Icons';
import './Footer.css';

const COLUMNAS = [
  {
    titulo: 'Explorar',
    links: [
      { label: 'Todos los productos', to: '/productos' },
      { label: 'Nuevos ingresos', to: '/productos?orden=nuevos' },
      { label: 'Indumentaria', to: '/productos?categoria=Ropa' },
      { label: 'Calzado', to: '/productos?categoria=Calzado' },
    ],
  },
  {
    titulo: 'Ayuda',
    links: [
      { label: 'Envíos y entregas', to: '/carrito' },
      { label: 'Cambios y devoluciones', to: '/mi-cuenta' },
      { label: 'Mis pedidos', to: '/mi-cuenta' },
      { label: 'Contacto', to: '/mi-cuenta' },
    ],
  },
];

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__top">
        <NewsletterForm />

        {COLUMNAS.map((col) => (
          <div key={col.titulo} className="footer__col">
            <h3 className="footer__heading">{col.titulo}</h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer__col">
          <h3 className="footer__heading">Seguinos</h3>
          <ul>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                Instagram <IconArrowUpRight size={12} />
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com" target="_blank" rel="noreferrer">
                TikTok <IconArrowUpRight size={12} />
              </a>
            </li>
            <li>Buenos Aires, AR</li>
            <li>Hecho para la calle.</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <Link to="/" className="footer__logo">
          ViralOutfits<sup>®</sup>
        </Link>
        <p>© 2026 ViralOutfits. Todos los derechos reservados.</p>
        <ul className="footer__legal">
          <li>Privacidad</li>
          <li>Términos y condiciones</li>
          <li>Botón de arrepentimiento</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
