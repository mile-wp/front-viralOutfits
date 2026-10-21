import { useState } from 'react';
import { IconChevronDown } from '../ui/Icons';

// Bloque plegable dentro del panel de filtros
const FilterGroup = ({ title, children, defaultOpen = true }) => {
  const [abierto, setAbierto] = useState(defaultOpen);

  return (
    <section className="filter-group">
      <button
        type="button"
        className="filter-group__toggle"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
      >
        {title}
        <IconChevronDown size={14} style={{ transform: abierto ? 'rotate(180deg)' : 'none' }} />
      </button>
      {abierto && <div className="filter-group__body">{children}</div>}
    </section>
  );
};

export default FilterGroup;
