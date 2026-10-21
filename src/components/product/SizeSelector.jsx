import './VariantSelector.css';

// talles: [{ talle, disponible }]
const SizeSelector = ({ talles, value, onChange, onOpenGuide }) => (
  <div className="variant">
    <div className="variant__header">
      <span className="variant__label">
        Talle: <strong>{value || 'Elegí uno'}</strong>
      </span>
      {onOpenGuide && (
        <button type="button" className="link" onClick={onOpenGuide}>
          Guía de talles
        </button>
      )}
    </div>
    <div className="variant__options" role="radiogroup" aria-label="Talle">
      {talles.map(({ talle, disponible }) => (
        <button
          key={talle}
          type="button"
          role="radio"
          aria-checked={value === talle}
          className={`size-btn ${value === talle ? 'size-btn--active' : ''}`}
          onClick={() => onChange(talle)}
          disabled={!disponible}
          title={disponible ? undefined : 'Sin stock'}
        >
          {talle}
        </button>
      ))}
    </div>
  </div>
);

export default SizeSelector;
