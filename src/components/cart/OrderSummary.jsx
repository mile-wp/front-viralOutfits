import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import CouponInput from './CouponInput';
import { IconChat, IconLock } from '../ui/Icons';
import { formatPrice } from '../../utils/format';
import { ENVIO_GRATIS_DESDE } from '../../utils/checkout';
import './Checkout.css';

// Resumen fijo a la derecha del checkout. El botón envía el formulario con id `formId`.
const OrderSummary = ({ totales, cantidad, cupon, onCupon, formId, enviando }) => (
  <aside className="summary">
    <div className="summary__box">
      <h2 className="summary__title">Resumen de compra</h2>

      <div className="summary__shipping">
        <p>
          {totales.faltaParaEnvioGratis > 0 ? (
            <>
              Te faltan <strong>{formatPrice(totales.faltaParaEnvioGratis)}</strong> para el envío gratis
            </>
          ) : (
            <strong>¡Tenés envío gratis!</strong>
          )}
        </p>
        <ProgressBar value={totales.subtotal / ENVIO_GRATIS_DESDE} label="Progreso hacia el envío gratis" />
      </div>

      <dl className="summary__lines">
        <div>
          <dt>Subtotal ({cantidad} {cantidad === 1 ? 'producto' : 'productos'})</dt>
          <dd>{formatPrice(totales.subtotal)}</dd>
        </div>
        <div>
          <dt>Descuentos</dt>
          <dd className={totales.descuento > 0 ? 'summary__discount' : ''}>
            {totales.descuento > 0 ? `-${formatPrice(totales.descuento)}` : formatPrice(0)}
          </dd>
        </div>
        <div>
          <dt>Envío</dt>
          <dd>{totales.envio === 0 ? 'Gratis' : formatPrice(totales.envio)}</dd>
        </div>
      </dl>

      <CouponInput cupon={cupon} onAplicar={onCupon} />

      <div className="summary__total">
        <span>Total</span>
        <strong>{formatPrice(totales.total)}</strong>
      </div>
      <p className="summary__installments">o 3 cuotas sin interés de {formatPrice(totales.total / 3)}</p>

      <Button type="submit" form={formId} full size="lg" arrow disabled={enviando}>
        {enviando ? 'Procesando…' : 'Finalizar compra'}
      </Button>
      <p className="summary__secure">
        <IconLock size={12} /> Pago 100% seguro
      </p>
    </div>

    <div className="summary__help">
      <IconChat size={16} />
      <p>
        <strong>¿Necesitás ayuda?</strong>
        <br />
        Escribinos por WhatsApp de lunes a viernes de 10 a 18 h.
      </p>
    </div>
  </aside>
);

export default OrderSummary;
