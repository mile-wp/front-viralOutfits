import { Link } from 'react-router-dom';
import Image from '../ui/Image';
import QuantitySelector from '../ui/QuantitySelector';
import { IconTrash } from '../ui/Icons';
import { formatPrice } from '../../utils/format';
import './Checkout.css';

// item: { varianteProductoId, productoId, nombreProducto, talle, color, precioUnitario, cantidad, imagen, stock }
const CartItem = ({ item, onCantidad, onQuitar }) => (
  <li className="cart-item">
    <Link to={`/productos/${item.productoId}`} className="cart-item__media">
      <Image src={item.imagen} alt={item.nombreProducto} />
    </Link>

    <div className="cart-item__info">
      <Link to={`/productos/${item.productoId}`} className="cart-item__name">
        {item.nombreProducto}
      </Link>
      <p className="cart-item__meta">
        Talle {item.talle} · {item.color}
      </p>
      <p className="cart-item__meta">{formatPrice(item.precioUnitario)} c/u</p>
    </div>

    <QuantitySelector
      size="sm"
      value={item.cantidad}
      max={item.stock}
      onChange={(cantidad) => onCantidad(item.varianteProductoId, cantidad)}
    />

    <div className="cart-item__end">
      <span className="cart-item__price">{formatPrice(item.precioUnitario * item.cantidad)}</span>
      <button
        type="button"
        className="cart-item__remove"
        onClick={() => onQuitar(item.varianteProductoId)}
        aria-label={`Quitar ${item.nombreProducto}`}
      >
        <IconTrash size={14} /> Quitar
      </button>
    </div>
  </li>
);

export default CartItem;
