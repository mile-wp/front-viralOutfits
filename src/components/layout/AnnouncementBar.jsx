import { formatPrice } from '../../utils/format';
import { ENVIO_GRATIS_DESDE } from '../../utils/checkout';

const AnnouncementBar = () => (
  <div
    style={{
      background: 'var(--red)',
      color: 'var(--white)',
      fontSize: '0.66rem',
      fontWeight: 800,
      letterSpacing: '0.1em',
      textAlign: 'center',
      textTransform: 'uppercase',
      padding: '8px 16px',
    }}
  >
    10% off con transferencia <span aria-hidden="true">/</span> 3 cuotas sin interés{' '}
    <span aria-hidden="true">/</span> Envío gratis desde {formatPrice(ENVIO_GRATIS_DESDE)}
  </div>
);

export default AnnouncementBar;
