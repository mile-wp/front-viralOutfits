import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const NotFound = () => (
  <div className="container">
    <EmptyState
      title="404. Te fuiste de código."
      text="La página que buscás no existe o se movió. Volvé al inicio o seguí recorriendo el catálogo."
    >
      <Button to="/" variant="dark">
        Ir al inicio
      </Button>
      <Button to="/productos" arrow>
        Ver productos
      </Button>
    </EmptyState>
  </div>
);

export default NotFound;
