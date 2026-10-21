import FormField from '../ui/FormField';
import Select from '../ui/Select';
import RadioCard from '../ui/RadioCard';
import { IconStore, IconTruck } from '../ui/Icons';
import { formatPrice } from '../../utils/format';
import { SHOWROOM } from '../../utils/checkout';

const PROVINCIAS = [
  'CABA',
  'Buenos Aires',
  'Córdoba',
  'Santa Fe',
  'Mendoza',
  'Tucumán',
  'Entre Ríos',
  'Salta',
  'Neuquén',
  'Río Negro',
].map((p) => ({ value: p, label: p }));

// Forma de entrega + dirección. `envio` es el costo calculado en la página.
const ShippingForm = ({ values, errors, onChange, envio }) => {
  const campo = (name) => ({ name, value: values[name], onChange, error: errors[name] });

  return (
    <div className="checkout-fields">
      <div className="checkout-options">
        <RadioCard
          name="entrega"
          value="domicilio"
          checked={values.entrega === 'domicilio'}
          onChange={onChange}
          icon={<IconTruck />}
          title="Envío a domicilio"
          description="Llega en 3 a 5 días hábiles"
          aside={envio === 0 ? 'Gratis' : formatPrice(envio)}
        />
        <RadioCard
          name="entrega"
          value="retiro"
          checked={values.entrega === 'retiro'}
          onChange={onChange}
          icon={<IconStore />}
          title="Retiro en showroom"
          description={SHOWROOM}
          aside="Gratis"
        />
      </div>

      {values.entrega === 'domicilio' && (
        <>
          <div className="form-row form-row--address">
            <FormField label="Calle" autoComplete="address-line1" required {...campo('calle')} />
            <FormField label="Número" inputMode="numeric" required {...campo('numero')} />
            <FormField label="Piso / Depto" placeholder="Opcional" {...campo('pisoDepto')} />
          </div>
          <div className="form-row">
            <FormField label="Código postal" inputMode="numeric" autoComplete="postal-code" required {...campo('codigoPostal')} />
            <FormField label="Localidad" autoComplete="address-level2" required {...campo('localidad')} />
            <Select label="Provincia" required options={PROVINCIAS} {...campo('provincia')} />
          </div>
        </>
      )}
    </div>
  );
};

export default ShippingForm;
