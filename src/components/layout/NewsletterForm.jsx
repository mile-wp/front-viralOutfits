import { useState } from 'react';
import { esEmail } from '../../utils/validation';
import { IconArrowRight } from '../ui/Icons';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState(null); // null | 'ok' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!esEmail(email)) {
      setEstado('error');
      return;
    }
    setEstado('ok');
    setEmail('');
  };

  return (
    <div className="newsletter">
      <span className="eyebrow">No te quedes afuera</span>
      <h2 className="newsletter__title">El próximo drop empieza acá.</h2>
      <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="newsletter-email" className="visually-hidden">
          Tu email
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEstado(null);
          }}
        />
        <button type="submit" aria-label="Suscribirme">
          <IconArrowRight size={22} />
        </button>
      </form>
      <p className={`newsletter__note ${estado === 'error' ? 'newsletter__note--error' : ''}`} aria-live="polite">
        {estado === 'ok' && '¡Listo! Te avisamos antes que a nadie.'}
        {estado === 'error' && 'Revisá el email, parece que tiene un error.'}
        {!estado && 'Novedades, accesos anticipados y nada de spam. Al suscribirte aceptás la política de privacidad.'}
      </p>
    </div>
  );
};

export default NewsletterForm;
