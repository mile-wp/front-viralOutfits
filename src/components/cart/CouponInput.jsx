import { useState } from 'react';
import { CUPONES } from '../../utils/checkout';

const CouponInput = ({ cupon, onAplicar }) => {
  const [codigo, setCodigo] = useState(cupon ?? '');
  const [error, setError] = useState(null);

  const aplicar = () => {
    const normalizado = codigo.trim().toUpperCase();
    if (!CUPONES[normalizado]) {
      setError('El código no es válido o ya venció.');
      return;
    }
    setError(null);
    onAplicar(normalizado);
  };

  return (
    <div className="coupon">
      <div className="coupon__row">
        <label htmlFor="cupon" className="visually-hidden">
          Código de descuento
        </label>
        <input
          id="cupon"
          placeholder="Código de descuento"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              aplicar();
            }
          }}
        />
        <button type="button" onClick={aplicar}>
          Aplicar
        </button>
      </div>
      {error && <p className="coupon__msg coupon__msg--error">{error}</p>}
      {cupon && !error && <p className="coupon__msg">Cupón {cupon} aplicado.</p>}
    </div>
  );
};

export default CouponInput;
