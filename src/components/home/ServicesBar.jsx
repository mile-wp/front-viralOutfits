import { IconCard, IconRefresh, IconShield, IconTruck } from '../ui/Icons';
import { formatPrice } from '../../utils/format';
import { ENVIO_GRATIS_DESDE } from '../../utils/checkout';
import './ServicesBar.css';

const SERVICIOS = [
  { icon: <IconTruck />, titulo: 'Envío a todo el país', texto: `Gratis desde ${formatPrice(ENVIO_GRATIS_DESDE)}` },
  { icon: <IconCard />, titulo: '3 cuotas sin interés', texto: 'Con todas las tarjetas' },
  { icon: <IconRefresh />, titulo: 'Cambios gratis', texto: 'Tenés 30 días para cambiar' },
  { icon: <IconShield />, titulo: 'Compra segura', texto: 'Tus datos siempre protegidos' },
];

const ServicesBar = () => (
  <section className="services">
    <ul className="services__list container">
      {SERVICIOS.map((s) => (
        <li key={s.titulo} className="services__item">
          {s.icon}
          <div>
            <p className="services__title">{s.titulo}</p>
            <p className="services__text">{s.texto}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default ServicesBar;
