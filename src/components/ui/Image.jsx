import { IMAGEN_FALLBACK } from '../../utils/product';

// <img> con imagen de reemplazo si la URL falla
const Image = ({ src, alt = '', ...props }) => (
  <img
    src={src || IMAGEN_FALLBACK}
    alt={alt}
    loading="lazy"
    onError={(e) => {
      if (e.currentTarget.src !== IMAGEN_FALLBACK) e.currentTarget.src = IMAGEN_FALLBACK;
    }}
    {...props}
  />
);

export default Image;
