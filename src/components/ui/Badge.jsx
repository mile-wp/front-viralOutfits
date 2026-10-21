import './Badge.css';

// variante: dark | light | red | success | muted | neutral
const Badge = ({ children, variante = 'dark', className = '' }) => (
  <span className={`badge badge--${variante} ${className}`}>{children}</span>
);

export default Badge;
