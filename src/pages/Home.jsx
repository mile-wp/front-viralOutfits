import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import PromoStrip from '../components/home/PromoStrip';
import CategoryCard from '../components/home/CategoryCard';
import BrandManifesto from '../components/home/BrandManifesto';
import ServicesBar from '../components/home/ServicesBar';
import SectionHeader from '../components/ui/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import { IconArrowUpRight } from '../components/ui/Icons';
import { useRequest } from '../hooks/useRequest';
import { getProductos } from '../services/productService';
import { getNuevosIds } from '../utils/product';
import './Home.css';

const CATEGORIAS_DESTACADAS = [
  {
    titulo: 'Buzos',
    bajada: 'Frisa pesada para el invierno',
    to: '/productos?q=buzo',
    imagen: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1200&q=80',
  },
  {
    titulo: 'Remeras',
    bajada: 'Algodón heavyweight, calce boxy',
    to: '/productos?q=remera',
    imagen: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?auto=format&fit=crop&w=1200&q=80',
  },
];

const Home = () => {
  const { data: productos, cargando } = useRequest(getProductos);
  const nuevosIds = productos ? getNuevosIds(productos) : new Set();
  const nuevos = productos ? productos.filter((p) => nuevosIds.has(p.id)).sort((a, b) => b.id - a.id) : [];

  return (
    <>
      <Hero />
      <PromoStrip />

      <section className="home-section container">
        <SectionHeader
          eyebrow="Recién llegado"
          title="Nuevos códigos."
          action={
            <Link to="/productos?orden=nuevos" className="link home-link">
              Ver todo <IconArrowUpRight size={12} />
            </Link>
          }
        />
        {cargando ? <p className="muted">Cargando productos…</p> : <ProductGrid productos={nuevos} nuevosIds={nuevosIds} />}
      </section>

      <section className="home-categories container">
        {CATEGORIAS_DESTACADAS.map((cat) => (
          <CategoryCard key={cat.titulo} {...cat} />
        ))}
      </section>

      <BrandManifesto />
      <ServicesBar />
    </>
  );
};

export default Home;
