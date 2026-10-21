import Button from '../ui/Button';

const BrandManifesto = () => (
  <section style={{ background: 'var(--beige)', padding: '72px 0' }}>
    <div
      className="container"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '32px 64px',
        alignItems: 'end',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span className="eyebrow">Esto es ViralOutfits</span>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
          De este lado,
          <br />
          las reglas
          <br />
          las ponés vos.
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--gray-700)', maxWidth: 460 }}>
          Nacimos en Buenos Aires para vestir a los que crean, no a los que siguen. Diseñamos prendas sin
          género, sin edad y hechas para durar. Lo que es viral hoy lo decide la calle.
        </p>
        <Button to="/productos" variant="outline" arrow>
          Conocé la colección
        </Button>
      </div>
    </div>
  </section>
);

export default BrandManifesto;
