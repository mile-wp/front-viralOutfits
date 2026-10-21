import './VariantSelector.css';

// colores: [{ nombre, hex, disponible }]
const ColorSelector = ({ colores, value, onChange }) => (
  <div className="variant">
    <span className="variant__label">
      Color: <strong>{value}</strong>
    </span>
    <div className="variant__options" role="radiogroup" aria-label="Color">
      {colores.map((color) => (
        <button
          key={color.nombre}
          type="button"
          role="radio"
          aria-checked={value === color.nombre}
          aria-label={color.nombre}
          title={color.disponible ? color.nombre : `${color.nombre} (sin stock)`}
          className={`swatch ${value === color.nombre ? 'swatch--active' : ''}`}
          onClick={() => onChange(color.nombre)}
          disabled={!color.disponible}
        >
          <span style={{ background: color.hex }} />
        </button>
      ))}
    </div>
  </div>
);

export default ColorSelector;
