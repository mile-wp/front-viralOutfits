import FormField from '../ui/FormField';
import Select from '../ui/Select';
import RadioCard from '../ui/RadioCard';
import { IconBank, IconCard, IconWallet } from '../ui/Icons';
import { formatPrice } from '../../utils/format';

// Medio de pago. Al back solo viaja el nombre del método (PedidoRequestDTO.metodoPago):
// los datos de la tarjeta son solo de maqueta y no se envían.
const PaymentForm = ({ values, errors, onChange, total }) => {
  const campo = (name) => ({ name, value: values[name], onChange, error: errors[name] });

  const cuotas = [1, 3].map((n) => ({
    value: String(n),
    label: n === 1 ? `1 pago de ${formatPrice(total)}` : `${n} cuotas sin interés de ${formatPrice(total / n)}`,
  }));

  return (
    <div className="checkout-options checkout-options--stack">
      <RadioCard
        name="metodoPago"
        value="tarjeta"
        checked={values.metodoPago === 'tarjeta'}
        onChange={onChange}
        icon={<IconCard />}
        title="Tarjeta de crédito o débito"
        description="Hasta 3 cuotas sin interés"
      >
        <FormField label="Número de tarjeta" inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" required {...campo('tarjetaNumero')} />
        <FormField label="Nombre como figura en la tarjeta" autoComplete="cc-name" required {...campo('tarjetaNombre')} />
        <div className="form-row">
          <FormField label="Vencimiento" placeholder="MM/AA" autoComplete="cc-exp" required {...campo('tarjetaVencimiento')} />
          <FormField label="CVV" inputMode="numeric" placeholder="123" autoComplete="cc-csc" required {...campo('tarjetaCvv')} />
        </div>
        <Select label="Cuotas" options={cuotas} {...campo('cuotas')} />
      </RadioCard>

      <RadioCard
        name="metodoPago"
        value="transferencia"
        checked={values.metodoPago === 'transferencia'}
        onChange={onChange}
        icon={<IconBank />}
        title="Transferencia bancaria"
        description="10% OFF sobre el subtotal"
        aside={<span style={{ color: 'var(--red)' }}>-10%</span>}
      >
        <p className="checkout-note">
          Al confirmar te mostramos el CBU y tenés 48 h para enviar el comprobante. El pedido se prepara cuando se
          acredita el pago.
        </p>
      </RadioCard>

      <RadioCard
        name="metodoPago"
        value="mercadopago"
        checked={values.metodoPago === 'mercadopago'}
        onChange={onChange}
        icon={<IconWallet />}
        title="Mercado Pago"
        description="Pagá con tu cuenta o dinero disponible"
      >
        <p className="checkout-note">Al finalizar te vamos a redirigir a Mercado Pago para completar el pago.</p>
      </RadioCard>
    </div>
  );
};

export default PaymentForm;
