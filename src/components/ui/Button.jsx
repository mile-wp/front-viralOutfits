import { Link } from 'react-router-dom';
import { IconArrowUpRight } from './Icons';
import './Button.css';

// Botón reutilizable. Si recibe `to` se renderiza como <Link>.
// variant: primary (rojo) | dark | outline | ghost
const Button = ({
  children,
  to,
  variant = 'primary',
  size = 'md',
  full = false,
  arrow = false,
  icon,
  className = '',
  type = 'button',
  ...props
}) => {
  const clases = ['btn', `btn--${variant}`, `btn--${size}`, full && 'btn--full', className]
    .filter(Boolean)
    .join(' ');

  const contenido = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <IconArrowUpRight size={16} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {contenido}
      </Link>
    );
  }

  return (
    <button type={type} className={clases} {...props}>
      {contenido}
    </button>
  );
};

export default Button;
