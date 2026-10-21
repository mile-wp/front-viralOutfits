import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const ASIDE = {
  imagen: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
  titulo: (
    <>
      De este lado,
      <br />
      las reglas
      <br />
      las ponés vos.
    </>
  ),
  texto: 'Sumate a la comunidad. Enterate de cada drop y llevá tu historia con vos.',
};

const Register = () => (
  <AuthLayout
    breadcrumb="Crear cuenta"
    eyebrow="Sumate a ViralOutfits"
    title={
      <>
        Tu historia
        <br />
        empieza acá.
      </>
    }
    subtitle="Creá tu cuenta. Guardá tus datos, seguí tus pedidos y enterate de lo que viene."
    aside={ASIDE}
  >
    <RegisterForm />
  </AuthLayout>
);

export default Register;
