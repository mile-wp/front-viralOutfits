import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Image from '../ui/Image';
import { formatPrice } from '../../utils/format';
import { getBadge, getColores, getImagenes, getTalles } from '../../utils/product';
import './CardProductos.css';

// Tarjeta de producto del catálogo. Lleva al detalle (/productos/:id).
const CardProductos = ({ product, esNuevo = false }) => {
  const [imagen, imagenHover] = getImagenes(product);
  const badge = getBadge(product, esNuevo);
  const colores = getColores(product);
  const talles = getTalles(product);
  const rangoTalles =
    talles.length > 1 ? `${talles[0].talle}–${talles[talles.length - 1].talle}` : talles[0]?.talle;

  return (
    <article className="card-producto">
      <Link to={`/productos/${product.id}`} className="card-producto__link">
        <div className="card-producto__media">
          <Image src={imagen} alt={product.nombre} className="card-producto__img" />
          {imagenHover && (
            <Image src={imagenHover} alt="" className="card-producto__img card-producto__img--hover" />
          )}
          {badge && (
            <Badge variante={badge.variante} className="card-producto__badge">
              {badge.texto}
            </Badge>
          )}
        </div>

        <div className="card-producto__info">
          <div className="card-producto__row">
            <h3 className="card-producto__nombre">{product.nombre}</h3>
            <span className="card-producto__precio">{formatPrice(product.precio)}</span>
          </div>
          <p className="card-producto__meta">
            {colores.map((c) => c.nombre).join(' · ')}
            {rangoTalles && ` — ${rangoTalles}`}
          </p>
          <p className="card-producto__promo">3 cuotas sin interés · 10% off con transferencia</p>
        </div>
      </Link>
    </article>
  );
};

export default CardProductos;
