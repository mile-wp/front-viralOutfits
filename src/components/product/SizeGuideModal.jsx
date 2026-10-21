import Modal from '../ui/Modal';
import './SizeGuideModal.css';

const MEDIDAS = {
  Ropa: {
    columnas: ['Talle', 'Pecho (cm)', 'Largo (cm)', 'Hombros (cm)'],
    filas: [
      ['S', '104', '68', '50'],
      ['M', '110', '71', '52'],
      ['L', '116', '74', '54'],
      ['XL', '122', '77', '56'],
    ],
  },
  Calzado: {
    columnas: ['Talle AR', 'US', 'EU', 'Largo pie (cm)'],
    filas: [
      ['39', '7', '40', '25'],
      ['40', '8', '41', '26'],
      ['41', '9', '42', '26.5'],
      ['42', '10', '43', '27.5'],
      ['43', '11', '44', '28'],
    ],
  },
  Accesorios: {
    columnas: ['Talle', 'Contorno (cm)'],
    filas: [['Único', '56 a 60 (regulable)']],
  },
};

const SizeGuideModal = ({ isOpen, onClose, categoria }) => {
  const tabla = MEDIDAS[categoria] ?? MEDIDAS.Ropa;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guía de talles">
      <p className="size-guide__intro">
        Medidas de la prenda tomada en plano. Si estás entre dos talles, te recomendamos el más grande.
      </p>
      <div className="size-guide__scroll">
        <table className="size-guide__table">
          <thead>
            <tr>
              {tabla.columnas.map((col) => (
                <th key={col} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.filas.map((fila) => (
              <tr key={fila[0]}>
                {fila.map((celda, i) => (i === 0 ? <th key={i} scope="row">{celda}</th> : <td key={i}>{celda}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default SizeGuideModal;
