import { useState } from 'react';
import { formatPrice } from '../../utils/format';

// Rango de precio con mínimo y máximo. Se aplica al enviar el formulario.
const PriceRangeFilter = ({ min, max, limites, onApply }) => {
  const [desde, setDesde] = useState(min);
  const [hasta, setHasta] = useState(max);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(desde, hasta);
  };

  return (
    <form className="price-filter" onSubmit={handleSubmit}>
      <div className="price-filter__inputs">
        <label>
          <span className="visually-hidden">Precio mínimo</span>
          <input
            type="number"
            min={0}
            step={1000}
            placeholder={formatPrice(limites.min)}
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </label>
        <span aria-hidden="true">—</span>
        <label>
          <span className="visually-hidden">Precio máximo</span>
          <input
            type="number"
            min={0}
            step={1000}
            placeholder={formatPrice(limites.max)}
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="link">
        Aplicar
      </button>
    </form>
  );
};

export default PriceRangeFilter;
