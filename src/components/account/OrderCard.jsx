import { useState } from 'react';
import Badge from '../ui/Badge';
import Image from '../ui/Image';
import OrderTracker from './OrderTracker';
import OrderItemRow from './OrderItemRow';
import { IconArrowUpRight, IconChevronDown, IconRefresh } from '../ui/Icons';
import { formatDate, formatOrderId, formatPrice } from '../../utils/format';
import { ESTADOS_PEDIDO, estaEnCurso } from '../../utils/pedido';
import './Account.css';

const sumarDias = (iso, dias) => {
  const fecha = new Date(iso);
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
};

// pedido: PedidoResponseDTO. `getImagen(varianteId)` resuelve la foto del producto.
const OrderCard = ({ pedido, getImagen, onRepetir, defaultOpen = false }) => {
  const [abierto, setAbierto] = useState(defaultOpen);
  const estado = ESTADOS_PEDIDO[pedido.estadoPedido] ?? ESTADOS_PEDIDO.PENDIENTE;
  const unidades = pedido.items.reduce((acc, i) => acc + i.cantidad, 0);
  const enCurso = estaEnCurso(pedido.estadoPedido);
  const fechaCorta = { day: 'numeric', month: 'long' };

  return (
    <article className={`order-card ${abierto ? 'order-card--open' : ''}`}>
      <header className="order-card__header">
        {!abierto && (
          <div className="order-card__thumbs">
            {pedido.items.slice(0, 2).map((item) => (
              <Image key={item.id} src={getImagen(item.varianteProductoId)} alt="" />
            ))}
          </div>
        )}
        <div className="order-card__title">
          <h3>Pedido {formatOrderId(pedido.id)}</h3>
          <p>
            Realizado el {formatDate(pedido.fecha)} · {unidades} {unidades === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <Badge variante={estado.tono}>{estado.label}</Badge>
        {!abierto && <span className="order-card__total">{formatPrice(pedido.total)}</span>}
        <button
          type="button"
          className="order-card__toggle"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-label={abierto ? 'Ocultar detalle' : 'Ver detalle'}
        >
          <IconChevronDown style={{ transform: abierto ? 'rotate(180deg)' : 'none' }} />
        </button>
      </header>

      {abierto && (
        <div className="order-card__body">
          {pedido.estadoPedido !== 'CANCELADO' && (
            <div className="order-card__tracking">
              {enCurso && (
                <div className="order-card__eta">
                  <div>
                    <span className="eyebrow">Entrega estimada</span>
                    <p>
                      Entre el {formatDate(sumarDias(pedido.fecha, 3), fechaCorta)} y el{' '}
                      {formatDate(sumarDias(pedido.fecha, 5), fechaCorta)}
                    </p>
                  </div>
                  {pedido.estadoPedido === 'ENVIADO' && (
                    <span className="link link--red">
                      Seguir envío <IconArrowUpRight size={11} />
                    </span>
                  )}
                </div>
              )}
              <OrderTracker estado={pedido.estadoPedido} />
            </div>
          )}

          <ul className="order-card__items">
            {pedido.items.map((item) => (
              <OrderItemRow key={item.id} item={item} imagen={getImagen(item.varianteProductoId)} />
            ))}
          </ul>

          <div className="order-card__footer">
            <div className="order-card__info">
              <p>
                <strong>Pago:</strong> {pedido.metodoPago}
              </p>
              <p>
                <strong>Entrega:</strong> {pedido.direccionEnvio}
              </p>
            </div>
            <div className="order-card__sum">
              <span>Total</span>
              <strong>{formatPrice(pedido.total)}</strong>
            </div>
          </div>

          <div className="order-card__actions">
            <button type="button" className="link" onClick={() => setAbierto(false)}>
              Ocultar detalle
            </button>
            <button type="button" className="link" onClick={() => onRepetir(pedido)}>
              <IconRefresh size={12} /> Repetir pedido
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default OrderCard;
