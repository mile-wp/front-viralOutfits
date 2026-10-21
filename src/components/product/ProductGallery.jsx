import { useState } from 'react';
import Badge from '../ui/Badge';
import Image from '../ui/Image';
import './ProductGallery.css';

const ProductGallery = ({ imagenes, nombre, badge }) => {
  const [activa, setActiva] = useState(0);

  return (
    <div className="gallery">
      <div className="gallery__main">
        <Image src={imagenes[activa]} alt={nombre} loading="eager" />
        {badge && (
          <Badge variante={badge.variante} className="gallery__badge">
            {badge.texto}
          </Badge>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="gallery__thumbs">
          {imagenes.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`gallery__thumb ${i === activa ? 'gallery__thumb--active' : ''}`}
              onClick={() => setActiva(i)}
              aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
            >
              <Image src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <p className="gallery__caption">
        {String(activa + 1).padStart(2, '0')} / {String(imagenes.length).padStart(2, '0')}
      </p>
    </div>
  );
};

export default ProductGallery;
