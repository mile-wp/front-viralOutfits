import { formatPrice } from '../../utils/format';
import { CUOTAS_SIN_INTERES, precioCuota, precioTransferencia } from '../../utils/product';

const PriceBlock = ({ precio }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{formatPrice(precio)}</span>
    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--red)' }}>
      {formatPrice(precioTransferencia(precio))} con transferencia (10% OFF)
    </span>
    <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
      {CUOTAS_SIN_INTERES} cuotas sin interés de {formatPrice(precioCuota(precio))}
    </span>
  </div>
);

export default PriceBlock;
