import { useId, useState } from 'react';
import { IconEye, IconEyeOff } from './Icons';
import './FormField.css';

// Campo de formulario: label + input + ayuda/error. Si type="password" agrega el botón para mostrarla.
const FormField = ({ label, required = false, hint, error, type = 'text', className = '', ...inputProps }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const esPassword = type === 'password';
  const descripcionId = error || hint ? `${id}-desc` : undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="field__control">
        <input
          id={id}
          type={esPassword && visible ? 'text' : type}
          className="field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={descripcionId}
          required={required}
          {...inputProps}
        />
        {esPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
      {(error || hint) && (
        <p id={descripcionId} className={error ? 'field__error' : 'field__hint'}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default FormField;
