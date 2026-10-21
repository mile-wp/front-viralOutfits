import { IconArrowRight } from './Icons';
import './Pagination.css';

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const paginas = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Paginación">
      {paginas.map((n) => (
        <button
          key={n}
          type="button"
          className={`pagination__page ${n === page ? 'pagination__page--active' : ''}`}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
        >
          {String(n).padStart(2, '0')}
        </button>
      ))}
      <button
        type="button"
        className="pagination__next"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente <IconArrowRight size={14} />
      </button>
    </nav>
  );
};

export default Pagination;
