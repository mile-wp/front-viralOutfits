import Button from '../ui/Button';
import './Hero.css';

const HERO_IMG =
  'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1800&q=80';

const Hero = () => (
  <section className="hero">
    <img src={HERO_IMG} alt="" className="hero__img editorial-img" />
    <div className="hero__overlay" />

    <div className="hero__content container">
      <div className="hero__tags">
        <span>Drop 07 — Otoño / Invierno</span>
        <span>Hecho en Buenos Aires · AR</span>
      </div>

      <div className="hero__text">
        <h1 className="hero__title display">
          No es moda.
          <br />
          Es tu código.
        </h1>
        <p className="hero__subtitle">
          Diseño urbano, hecho para durar. Prendas que no siguen tendencias: las arman los que las usan.
        </p>
        <Button to="/productos?orden=nuevos" size="lg" arrow>
          Comprar ahora
        </Button>
      </div>
    </div>
  </section>
);

export default Hero;
