import { IconMinus, IconPlus } from './Icons';
import './QuantitySelector.css';

const QuantitySelector = ({ value, onChange, min = 1, max = Infinity, disabled = false, size = 'md' }) => (
  <div className={`qty qty--${size}`}>
    <button
      type="button"
      onClick={() => onChange(value - 1)}
      disabled={disabled || value <= min}
      aria-label="Restar uno"
    >
      <IconMinus size={14} />
    </button>
    <span aria-live="polite">{value}</span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      disabled={disabled || value >= max}
      aria-label="Sumar uno"
    >
      <IconPlus size={14} />
    </button>
  </div>
);

export default QuantitySelector;
