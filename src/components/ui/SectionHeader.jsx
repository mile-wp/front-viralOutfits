import './SectionHeader.css';

// Encabezado de sección: eyebrow rojo + título en mayúsculas + bajada + acción a la derecha.
// `as` permite usarlo como título principal de la página (h1).
const SectionHeader = ({ eyebrow, title, subtitle, action, as: Heading = 'h2', size = 'md' }) => (
  <header className={`section-header section-header--${size}`}>
    <div className="section-header__text">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading className="section-header__title display">{title}</Heading>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </div>
    {action && <div className="section-header__action">{action}</div>}
  </header>
);

export default SectionHeader;
