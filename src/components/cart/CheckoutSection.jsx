import './Checkout.css';

// Bloque numerado del checkout (1 Tu bolsa, 2 Tus datos, ...)
const CheckoutSection = ({ numero, titulo, accion, children }) => (
  <section className="checkout-section">
    <header className="checkout-section__header">
      <span className="checkout-section__number">{numero}</span>
      <h2 className="checkout-section__title">{titulo}</h2>
      {accion && <div className="checkout-section__action">{accion}</div>}
    </header>
    <div className="checkout-section__body">{children}</div>
  </section>
);

export default CheckoutSection;
