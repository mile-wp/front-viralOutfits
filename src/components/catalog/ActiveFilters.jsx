import { IconClose } from '../ui/Icons';
import './ActiveFilters.css';

// chips: [{ key, value, label }]
const ActiveFilters = ({ chips, onRemove, onClear }) => {
  if (chips.length === 0) return null;

  return (
    <div className="active-filters">
      <span className="active-filters__label">Filtrado:</span>
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          className="active-filters__chip"
          onClick={() => onRemove(chip.key, chip.value)}
          aria-label={`Quitar filtro ${chip.label}`}
        >
          {chip.label} <IconClose size={12} />
        </button>
      ))}
      <button type="button" className="link" onClick={onClear}>
        Limpiar todo
      </button>
    </div>
  );
};

export default ActiveFilters;
