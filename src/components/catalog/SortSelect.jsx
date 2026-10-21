import Select from '../ui/Select';

const OPCIONES_ORDEN = [
  { value: 'relevancia', label: 'Ordenar: Más relevantes' },
  { value: 'nuevos', label: 'Ordenar: Más nuevos' },
  { value: 'precio-asc', label: 'Ordenar: Menor precio' },
  { value: 'precio-desc', label: 'Ordenar: Mayor precio' },
];

const SortSelect = ({ value, onChange }) => (
  <Select
    aria-label="Ordenar productos"
    size="sm"
    options={OPCIONES_ORDEN}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SortSelect;
