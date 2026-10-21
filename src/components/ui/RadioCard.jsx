import './RadioCard.css';

// Opción de radio con forma de tarjeta. Cuando está seleccionada muestra `children` (contenido extra).
const RadioCard = ({ name, value, checked, onChange, title, description, icon, aside, children }) => (
  <div className={`radio-card ${checked ? 'radio-card--checked' : ''}`}>
    <label className="radio-card__header">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {icon && <span className="radio-card__icon">{icon}</span>}
      <span className="radio-card__text">
        <span className="radio-card__title">{title}</span>
        {description && <span className="radio-card__description">{description}</span>}
      </span>
      {aside && <span className="radio-card__aside">{aside}</span>}
    </label>
    {checked && children && <div className="radio-card__body">{children}</div>}
  </div>
);

export default RadioCard;
