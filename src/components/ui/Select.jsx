import { useId } from 'react';
import './FormField.css';

// options: [{ value, label }]
const Select = ({ label, options, size = 'md', required = false, error, className = '', ...props }) => {
  const id = useId();

  return (
    <div className={`field select--${size} ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <select id={id} className="select__input" required={required} {...props}>
        {options.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      {error && <p className="field__error">{error}</p>}
    </div>
  );
};

export default Select;
