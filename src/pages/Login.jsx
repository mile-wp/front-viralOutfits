import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const ASIDE = {
  imagen: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&w=1200&q=80',
  titulo: (
    <>
      Tu código.
      <br />
      Tu lugar.
    </>
  ),
  texto: 'Tus pedidos, tus datos y lo que viene. Todo en un mismo lugar.',
};

const Login = () => (
  <AuthLayout
    breadcrumb="Iniciar sesión"
    eyebrow="Tu espacio en ViralOutfits"
    title={
      <>
        Qué bueno
        <br />
        verte de nuevo.
      </>
    }
    subtitle="Iniciá sesión para seguir tus pedidos y comprar más fácil."
    aside={ASIDE}
  >
    <LoginForm />
  </AuthLayout>
);

export default Login;
