import './FormField.css';

const Checkbox = ({ children, extra, error, className = '', ...props }) => (
  <div className={className}>
    <label className="checkbox">
      <input type="checkbox" {...props} />
      <span>{children}</span>
      {extra !== undefined && <span className="checkbox__extra">{extra}</span>}
    </label>
    {error && <p className="field__error">{error}</p>}
  </div>
);

export default Checkbox;
