import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

// items: [{ label, to? }] — el último es la página actual
const Breadcrumbs = ({ items }) => (
  <nav className="breadcrumbs" aria-label="Migas de pan">
    <ol>
      {items.map((item, i) => {
        const esUltimo = i === items.length - 1;
        return (
          <li key={item.label}>
            {item.to && !esUltimo ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current={esUltimo ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
