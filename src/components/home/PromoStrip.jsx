import { Link } from 'react-router-dom';
import { IconArrowUpRight } from '../ui/Icons';
import './PromoStrip.css';

const PROMOS = [
  { texto: 'Indumentaria de temporada', to: '/productos?categoria=Ropa' },
  { texto: 'Calzado para la calle', to: '/productos?categoria=Calzado' },
  { texto: 'Accesorios del drop', to: '/productos?categoria=Accesorios' },
];

const PromoStrip = () => (
  <div className="promo-strip">
    <div className="promo-strip__inner container">
      {PROMOS.map((promo) => (
        <Link key={promo.texto} to={promo.to} className="promo-strip__item">
          {promo.texto} <IconArrowUpRight size={14} />
        </Link>
      ))}
    </div>
  </div>
);

export default PromoStrip;
