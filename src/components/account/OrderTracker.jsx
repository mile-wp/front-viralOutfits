import { IconCheck } from '../ui/Icons';
import { getIndicePaso, PASOS_ENVIO } from '../../utils/pedido';
import './Account.css';

// Seguimiento: Confirmado → Preparado → En camino → Entregado
const OrderTracker = ({ estado }) => {
  const actual = getIndicePaso(estado);

  return (
    <ol className="tracker">
      {PASOS_ENVIO.map((paso, i) => {
        const completo = i < actual || estado === 'ENTREGADO';
        const esActual = i === actual && estado !== 'ENTREGADO';
        return (
          <li
            key={paso.estado}
            className={`tracker__step ${completo ? 'tracker__step--done' : ''} ${esActual ? 'tracker__step--current' : ''}`}
          >
            <span className="tracker__dot">{completo && <IconCheck size={11} />}</span>
            <span className="tracker__label">{paso.label}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderTracker;
