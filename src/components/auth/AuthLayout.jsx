import Breadcrumbs from '../ui/Breadcrumbs';
import SectionHeader from '../ui/SectionHeader';
import { IconArrowUpRight } from '../ui/Icons';
import './AuthLayout.css';

// Estructura compartida por Login y Registro: formulario a la izquierda, panel editorial a la derecha.
const AuthLayout = ({ breadcrumb, eyebrow, title, subtitle, aside, children }) => (
  <div className="container">
    <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mi cuenta', to: '/mi-cuenta' }, { label: breadcrumb }]} />

    <div className="auth">
      <section className="auth__form">
        <SectionHeader as="h1" size="lg" eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {children}
      </section>

      <aside className="auth__aside">
        <img src={aside.imagen} alt="" className="auth__img editorial-img" />
        <div className="auth__shade" />
        <div className="auth__tags">
          <span>ViralOutfits / Comunidad</span>
          <span>Drop 07 — Buenos Aires</span>
        </div>
        <div className="auth__aside-text">
          <span className="auth__line" />
          <h2 className="auth__aside-title display">{aside.titulo}</h2>
          <p>{aside.texto}</p>
          <span className="auth__aside-foot">
            Hecho para habitar la calle <IconArrowUpRight size={12} />
          </span>
        </div>
      </aside>
    </div>
  </div>
);

export default AuthLayout;
