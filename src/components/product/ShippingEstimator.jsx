import { useState } from 'react';
import { formatPrice } from '../../utils/format';
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE } from '../../utils/checkout';
import { IconTruck } from '../ui/Icons';
import './ShippingEstimator.css';

// Estimador de envío por código postal (maqueta: el back todavía no calcula envíos)
const ShippingEstimator = ({ precio }) => {
  const [cp, setCp] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(cp.trim())) {
      setResultado({ error: 'Ingresá un código postal de 4 números.' });
      return;
    }
    const esAmba = Number(cp) < 1900;
    setResultado({
      plazo: esAmba ? 'Llega entre 2 y 4 días hábiles' : 'Llega entre 4 y 7 días hábiles',
      costo: precio >= ENVIO_GRATIS_DESDE ? 'Gratis' : formatPrice(COSTO_ENVIO),
    });
  };

  return (
    <div className="shipping-estimator">
      <p className="shipping-estimator__title">
        <IconTruck size={16} /> ¿Cuándo llega?
      </p>
      <form className="shipping-estimator__form" onSubmit={handleSubmit}>
        <label htmlFor="cp" className="visually-hidden">
          Código postal
        </label>
        <input
          id="cp"
          inputMode="numeric"
          maxLength={4}
          placeholder="Tu código postal"
          value={cp}
          onChange={(e) => {
            setCp(e.target.value);
            setResultado(null);
          }}
        />
        <button type="submit">Calcular</button>
      </form>
      {resultado?.error && <p className="shipping-estimator__error">{resultado.error}</p>}
      {resultado?.plazo && (
        <p className="shipping-estimator__result">
          {resultado.plazo} · <strong>{resultado.costo}</strong>
        </p>
      )}
    </div>
  );
};

export default ShippingEstimator;
