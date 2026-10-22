import { useEffect, useMemo, useState } from 'react';
import './ResumenCarrito.css';

const LOGIN_ENDPOINT = '/auth/login';
const REGISTER_ENDPOINT = '/auth/registro';
const CART_ENDPOINT = '/api/carrito';
const SHIPPING_COST = 6500;
const FREE_SHIPPING_THRESHOLD = 150000;

const formatPrice = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

const getCartEntries = (payload) => {
  const entries = Array.isArray(payload)
    ? payload
    : payload?.items ??
      payload?.carrito?.items ??
      payload?.productos ??
      payload?.data?.items ??
      payload?.data;

  if (!Array.isArray(entries)) {
    throw new Error('La respuesta del carrito no tiene el formato esperado.');
  }

  return entries.map((entry, index) => {
    const product = entry.producto ?? entry.product ?? entry;
    const quantity = Number(entry.cantidad ?? entry.quantity ?? entry.qty);
    const price = Number(
      entry.precioUnitario ??
        product.precio ??
        product.precioUnitario ??
        product.price ??
        entry.precio ??
        entry.price,
    );
    const name = entry.nombreProducto ?? product.nombre ?? product.name;

    if (!name || !Number.isFinite(price) || price < 0) {
      throw new Error('Un producto del carrito no tiene nombre o precio válido.');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`La cantidad de "${name}" no es válida.`);
    }

    return {
      id: entry.id ?? `${product.id ?? 'item'}-${index}`,
      name,
      image: product.imagen ?? product.image ?? product.imageUrl ?? '',
      color: entry.color ?? product.color ?? '',
      size: entry.talle ?? entry.size ?? product.talle ?? product.size ?? '',
      price,
      quantity,
    };
  });
};

const fetchCart = (token, signal) =>
  fetch(CART_ENDPOINT, {
    signal,
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (response) => {
    if (!response.ok) {
      const error = new Error(`No se pudo cargar el carrito (HTTP ${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return getCartEntries(await response.json());
  });

function ResumenCarrito({ cartItems, onCartItemsChange }) {
  const localCartMode = Array.isArray(cartItems);
  const [items, setItems] = useState(cartItems ?? []);
  const [loading, setLoading] = useState(
    () => !localCartMode && Boolean(sessionStorage.getItem('viralOutfitsToken')),
  );
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem('viralOutfitsToken') ?? '',
  );
  const needsLogin = !localCartMode && !accessToken;
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [delivery, setDelivery] = useState('home');
  const [payment, setPayment] = useState('card');
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [notice, setNotice] = useState('');
  const visibleItems = localCartMode ? cartItems : items;

  useEffect(() => {
    if (localCartMode || !accessToken) return undefined;

    const controller = new AbortController();

    fetchCart(accessToken, controller.signal)
      .then((cartItems) => {
        setItems(cartItems);
        setError('');
      })
      .catch((fetchError) => {
        if (fetchError.name === 'AbortError') return;
        if (fetchError.status === 401) {
          sessionStorage.removeItem('viralOutfitsToken');
          setAccessToken('');
          setLoginError('Tu sesión no es válida. Iniciá sesión nuevamente.');
          return;
        }
        if (fetchError.status === 403) {
          setError('Tu cuenta no tiene permisos para consultar el carrito.');
          return;
        }
        setError(fetchError.message || 'No se pudo cargar el carrito.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [accessToken, localCartMode]);

  const authenticate = async (email, password) => {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasena: password }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || payload.mensaje || `No se pudo iniciar sesión (HTTP ${response.status}).`);
    }
    if (!payload.token) {
      throw new Error('La respuesta del login no incluyó un token de autenticación.');
    }

    sessionStorage.setItem('viralOutfitsToken', payload.token);
    setLoading(true);
    setAccessToken(payload.token);
    setError('');
  };

  const login = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setAuthMessage('');

    const formData = new FormData(event.currentTarget);
    try {
      await authenticate(formData.get('email'), formData.get('password'));
    } catch (loginFailure) {
      setLoginError(loginFailure.message || 'No se pudo iniciar sesión.');
    } finally {
      setLoginLoading(false);
    }
  };

  const register = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setAuthMessage('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.get('firstName'),
          apellido: formData.get('lastName'),
          email,
          contrasena: password,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || payload.mensaje || `No se pudo crear la cuenta (HTTP ${response.status}).`);
      }

      setAuthMessage('Cuenta creada. Iniciando sesión...');
      await authenticate(email, password);
    } catch (registrationFailure) {
      setLoginError(registrationFailure.message || 'No se pudo crear la cuenta.');
    } finally {
      setLoginLoading(false);
    }
  };

  const subtotal = useMemo(
    () => visibleItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [visibleItems],
  );
  const shipping = delivery === 'pickup' || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = payment === 'transfer' ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal + shipping - discount;
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const updateQuantity = (id, change) => {
    const updateItems = (currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      );
    if (localCartMode) {
      onCartItemsChange(updateItems(cartItems));
      return;
    }
    setItems(updateItems);
  };

  const removeItem = (id) => {
    if (localCartMode) {
      onCartItemsChange(cartItems.filter((item) => item.id !== id));
      return;
    }
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const applyCoupon = (event) => {
    event.preventDefault();
    setCouponMessage(
      coupon.trim()
        ? 'La validación de cupones todavía no está conectada.'
        : 'Ingresá un código para continuar.',
    );
  };

  const confirmPurchase = (event) => {
    event.preventDefault();
    setNotice('El checkout está listo visualmente; falta conectar la confirmación de compra con el backend.');
  };

  return (
    <div className="checkout-page">
      <div className="checkout-promo">
        20% OFF CON TRANSFERENCIA&nbsp; / &nbsp;ENVÍO GRATIS DESDE $150.000
      </div>

      <header className="checkout-header">
        <a className="checkout-brand" href="/" aria-label="ViralOutfits, inicio">
          ViralOutfits<sup>®</sup>
        </a>
        <nav className="checkout-nav" aria-label="Categorías">
          <a href="/">Nuevo</a>
          <a href="/">Indumentaria</a>
          <a href="/">Accesorios</a>
          <a href="/">Campaña</a>
          <a className="checkout-sale" href="/">Sale</a>
        </nav>
        <div className="checkout-header-actions" aria-label="Tu cuenta y carrito">
          <span aria-hidden="true">♙</span>
          <span aria-hidden="true">♧</span>
          <span>({visibleItems.reduce((count, item) => count + item.quantity, 0)})</span>
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-breadcrumb">Inicio&nbsp; / &nbsp;Tu bolsa&nbsp; / &nbsp;Finalizar compra</div>
        <div className="checkout-heading-row">
          <div>
            <h1>Hacelo tuyo.</h1>
            <p className="checkout-secure-mobile">♙ Checkout seguro</p>
          </div>
          <span className="checkout-secure">♙&nbsp; Checkout seguro</span>
        </div>

        {needsLogin && !loading && (
          <form className="checkout-auth-panel" onSubmit={authMode === 'login' ? login : register}>
            <h2>{authMode === 'login' ? 'Iniciá sesión para ver tu bolsa' : 'Creá tu cuenta'}</h2>
            <p>
              {authMode === 'login'
                ? 'Ingresá con tu cuenta para consultar el carrito.'
                : 'Registrate gratis para guardar tus datos y continuar.'}
            </p>
            {authMode === 'register' && (
              <>
                <label className="checkout-field">
                  Nombre
                  <input name="firstName" autoComplete="given-name" required />
                </label>
                <label className="checkout-field">
                  Apellido
                  <input name="lastName" autoComplete="family-name" required />
                </label>
              </>
            )}
            <label className="checkout-field">
              Email
              <input type="email" name="email" autoComplete="username" required />
            </label>
            <label className="checkout-field">
              Contraseña
              <input type="password" name="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={authMode === 'register' ? 6 : undefined} required />
            </label>
            {loginError && <p className="checkout-auth-error" role="alert">{loginError}</p>}
            {authMessage && <p className="checkout-auth-success" role="status">{authMessage}</p>}
            <button className="checkout-confirm" type="submit" disabled={loginLoading}>
              {loginLoading
                ? (authMode === 'login' ? 'Ingresando...' : 'Creando cuenta...')
                : (authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
            </button>
            <p className="checkout-auth-switch">
              {authMode === 'login' ? '¿Todavía no tenés cuenta?' : '¿Ya tenés una cuenta?'}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setLoginError('');
                  setAuthMessage('');
                }}
              >
                {authMode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </p>
          </form>
        )}
        {loading && <p className="checkout-state" role="status">Cargando tu bolsa...</p>}
        {error && (
          <div className="checkout-state checkout-error" role="alert">
            <p>{error}</p>
            <p>Verificá que el backend esté activo en http://localhost:8080.</p>
          </div>
        )}

        {!loading && !error && !needsLogin && (
          <form className="checkout-layout" onSubmit={confirmPurchase}>
            <div className="checkout-steps">
              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <span className="checkout-step-number">01</span>
                  <h2>Tu bolsa <span>({visibleItems.reduce((count, item) => count + item.quantity, 0)} productos)</span></h2>
                  <a href="/">Seguir comprando&nbsp; →</a>
                </div>

                {visibleItems.length === 0 ? (
                  <p className="checkout-empty">Tu bolsa está vacía. Agregá productos para continuar.</p>
                ) : (
                  <ul className="checkout-items">
                    {visibleItems.map((item) => (
                      <li className="checkout-item" key={item.id}>
                        {item.image ? (
                          <img className="checkout-item-image" src={item.image} alt={item.name} />
                        ) : (
                          <div className="checkout-item-placeholder" aria-hidden="true">
                            {item.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className="checkout-item-details">
                          <h3>{item.name}</h3>
                          <p>{[item.color, item.size].filter(Boolean).join(' / ') || 'Color y talle a confirmar'}</p>
                        </div>
                        <div className="checkout-quantity" aria-label={`Cantidad de ${item.name}`}>
                          <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Restar ${item.name}`}>−</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Sumar ${item.name}`}>+</button>
                        </div>
                        <div className="checkout-item-price">
                          <strong>{formatPrice(item.price * item.quantity)}</strong>
                          <button type="button" onClick={() => removeItem(item.id)}>Eliminar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <span className="checkout-step-number">02</span>
                  <h2>Tus datos</h2>
                </div>
                <div className="checkout-fields">
                  <label className="checkout-field checkout-field-wide">
                    Email *
                    <input type="email" name="email" autoComplete="email" required />
                  </label>
                  <label className="checkout-field">
                    Nombre *
                    <input name="firstName" autoComplete="given-name" required />
                  </label>
                  <label className="checkout-field">
                    Apellido *
                    <input name="lastName" autoComplete="family-name" required />
                  </label>
                  <label className="checkout-field">
                    Teléfono *
                    <input type="tel" name="phone" autoComplete="tel" required />
                  </label>
                  <label className="checkout-field">
                    DNI *
                    <input name="dni" inputMode="numeric" required />
                  </label>
                </div>
              </section>

              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <span className="checkout-step-number">03</span>
                  <h2>¿Dónde lo recibís?</h2>
                </div>
                <div className="checkout-choice-row">
                  <label className={delivery === 'home' ? 'checkout-choice selected' : 'checkout-choice'}>
                    <input type="radio" name="delivery" value="home" checked={delivery === 'home'} onChange={() => setDelivery('home')} />
                    Envío a domicilio
                  </label>
                  <label className={delivery === 'pickup' ? 'checkout-choice selected' : 'checkout-choice'}>
                    <input type="radio" name="delivery" value="pickup" checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} />
                    Retiro en punto de entrega
                  </label>
                </div>
                {delivery === 'home' && (
                  <div className="checkout-fields checkout-address">
                    <label className="checkout-field checkout-field-wide">Calle *<input name="street" autoComplete="address-line1" required /></label>
                    <label className="checkout-field">Número *<input name="streetNumber" required /></label>
                    <label className="checkout-field">Piso / Depto<input name="apartment" /></label>
                    <label className="checkout-field">Código postal *<input name="postalCode" autoComplete="postal-code" required /></label>
                    <label className="checkout-field">Ciudad *<input name="city" autoComplete="address-level2" required /></label>
                    <label className="checkout-field checkout-field-wide">Provincia *<select name="province" defaultValue="" required><option value="" disabled>Seleccioná una provincia</option><option>Buenos Aires</option><option>Ciudad Autónoma de Buenos Aires</option><option>Córdoba</option><option>Santa Fe</option><option>Mendoza</option><option>Otra</option></select></label>
                  </div>
                )}
                <div className="checkout-shipping-note">
                  <span>● {delivery === 'home' ? 'Envío estándar a domicilio' : 'Retiro en punto de entrega'}</span>
                  <strong>{formatPrice(shipping)}</strong>
                </div>
              </section>

              <section className="checkout-section checkout-payment-section">
                <div className="checkout-section-heading">
                  <span className="checkout-step-number">04</span>
                  <h2>Elegí cómo pagar</h2>
                </div>
                <label className={payment === 'card' ? 'checkout-payment-option selected' : 'checkout-payment-option'}>
                  <span className="checkout-payment-title">
                    <input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={() => setPayment('card')} />
                    Tarjeta de crédito o débito
                    <span>VISA&nbsp; / &nbsp;Mastercard&nbsp; / &nbsp;AMEX</span>
                  </span>
                  {payment === 'card' && (
                    <div className="checkout-fields checkout-card-fields">
                      <label className="checkout-field checkout-field-wide">Número de tarjeta *<input inputMode="numeric" autoComplete="cc-number" required /></label>
                      <label className="checkout-field">Vencimiento *<input placeholder="MM / AA" autoComplete="cc-exp" required /></label>
                      <label className="checkout-field">CVV *<input inputMode="numeric" autoComplete="cc-csc" required /></label>
                      <label className="checkout-field checkout-field-wide">Titular de la tarjeta *<input autoComplete="cc-name" required /></label>
                    </div>
                  )}
                </label>
                <label className={payment === 'transfer' ? 'checkout-payment-option selected' : 'checkout-payment-option'}>
                  <span className="checkout-payment-title">
                    <input type="radio" name="payment" value="transfer" checked={payment === 'transfer'} onChange={() => setPayment('transfer')} />
                    Transferencia bancaria
                    <span className="checkout-transfer-note">20% OFF en productos</span>
                  </span>
                </label>
                <label className={payment === 'wallet' ? 'checkout-payment-option selected' : 'checkout-payment-option'}>
                  <span className="checkout-payment-title">
                    <input type="radio" name="payment" value="wallet" checked={payment === 'wallet'} onChange={() => setPayment('wallet')} />
                    Mercado Pago
                    <span>Pagá con tu cuenta o saldo disponible</span>
                  </span>
                </label>
              </section>
            </div>

            <aside className="checkout-summary">
              <h2>Resumen de tu pedido</h2>
              <p className="checkout-free-shipping">
                {amountForFreeShipping > 0
                  ? `Te faltan ${formatPrice(amountForFreeShipping)} para conseguir envío gratis.`
                  : '¡Ya tenés envío gratis!'}
              </p>
              <div className="checkout-progress" role="progressbar" aria-label="Progreso para envío gratis" aria-valuenow={Math.round(freeShippingProgress)} aria-valuemin="0" aria-valuemax="100">
                <span style={{ width: `${freeShippingProgress}%` }} />
              </div>
              <dl className="checkout-totals">
                <div><dt>Subtotal ({visibleItems.reduce((count, item) => count + item.quantity, 0)} productos)</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div><dt>Envío estándar</dt><dd>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd></div>
                <div><dt>Descuentos</dt><dd>{discount > 0 ? `− ${formatPrice(discount)}` : formatPrice(0)}</dd></div>
              </dl>
              <div className="checkout-coupon">
                <label className="visually-hidden" htmlFor="coupon">Código de descuento</label>
                <input id="coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Código de descuento" />
                <button type="button" onClick={applyCoupon}>Aplicar</button>
              </div>
              {couponMessage && <p className="checkout-message" role="status">{couponMessage}</p>}
              <div className="checkout-grand-total">
                <span>Total ARS</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <p className="checkout-installments">El total puede variar según el medio de pago seleccionado.</p>
              <label className="checkout-terms">
                <input type="checkbox" required />
                Acepto los términos y condiciones y la política de privacidad.
              </label>
              {notice && <p className="checkout-message" role="status">{notice}</p>}
              <button className="checkout-confirm" type="submit" disabled={visibleItems.length === 0}>Confirmar y pagar <span aria-hidden="true">↗</span></button>
              <p className="checkout-protected">♙ Pago cifrado y protegido</p>
              <div className="checkout-help">
                <strong>¿Necesitás una mano?</strong>
                <p>Escribinos para ayudarte con tu compra.</p>
                <a href="mailto:hola@viraloutfits.com">Contactar soporte ↗</a>
              </div>
            </aside>
          </form>
        )}
      </main>

      <footer className="checkout-footer">
        <div className="checkout-footer-main">
          <div>
            <span className="checkout-footer-eyebrow">No te quedes afuera.</span>
            <h2>El próximo drop empieza acá.</h2>
            <form className="checkout-newsletter" onSubmit={(event) => event.preventDefault()}>
              <label className="visually-hidden" htmlFor="newsletter-email">Tu email</label>
              <input id="newsletter-email" type="email" placeholder="Tu email" />
              <button type="submit" aria-label="Suscribirme">→</button>
            </form>
          </div>
          <div><h3>Explorar</h3><a href="/">Todos los productos</a><a href="/">Nuevos ingresos</a><a href="/">Campaña</a><a href="/">Sobre Viral</a></div>
          <div><h3>Ayuda</h3><a href="/">Envíos y entregas</a><a href="/">Cambios y devoluciones</a><a href="/">Guía de talles</a><a href="/">Contacto</a></div>
          <div><h3>Seguinos</h3><a href="/">Instagram ↗</a><a href="/">TikTok ↗</a><a href="/">Buenos Aires, AR</a></div>
        </div>
        <div className="checkout-footer-bottom">
          <a className="checkout-brand" href="/">ViralOutfits<sup>®</sup></a>
          <span>© 2026 ViralOutfits. Todos los derechos reservados.</span>
          <span>Privacidad&nbsp; / &nbsp;Términos y condiciones</span>
        </div>
      </footer>
    </div>
  );
}

export default ResumenCarrito;
