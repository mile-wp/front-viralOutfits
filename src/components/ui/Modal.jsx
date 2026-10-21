import { useEffect, useId } from 'react';
import { IconClose } from './Icons';
import './Modal.css';

// Modal accesible: cierra con Escape, con el botón o clickeando el fondo.
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal" onMouseDown={onClose}>
      <div
        className={`modal__panel modal__panel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar" autoFocus>
            <IconClose />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
