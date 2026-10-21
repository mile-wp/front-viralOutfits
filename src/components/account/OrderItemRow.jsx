import Image from '../ui/Image';
import { formatPrice } from '../../utils/format';
import './Account.css';

// item: PedidoItemResponseDTO { nombreProducto, talla, color, precioUnitario, cantidad, subtotal }
const OrderItemRow = ({ item, imagen }) => (
  <li className="order-item">
    <div className="order-item__media">
      <Image src={imagen} alt={item.nombreProducto} />
    </div>
    <div className="order-item__info">
      <p className="order-item__name">{item.nombreProducto}</p>
      <p className="order-item__meta">
        Talle {item.talla} · {item.color} · Cant. {item.cantidad}
      </p>
    </div>
    <span className="order-item__price">{formatPrice(item.subtotal)}</span>
  </li>
);

export default OrderItemRow;
