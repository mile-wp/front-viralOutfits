import { Link } from 'react-router-dom';
import { IconArrowUpRight } from '../ui/Icons';
import './CategoryCard.css';

const CategoryCard = ({ titulo, bajada, imagen, to }) => (
  <Link to={to} className="category-card">
    <img src={imagen} alt="" className="category-card__img editorial-img" loading="lazy" />
    <div className="category-card__label">
      <div>
        <h3 className="category-card__title display">{titulo}</h3>
        <p className="category-card__text">{bajada}</p>
      </div>
      <span className="category-card__arrow">
        <IconArrowUpRight />
      </span>
    </div>
  </Link>
);

export default CategoryCard;
