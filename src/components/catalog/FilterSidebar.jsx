import Checkbox from '../ui/Checkbox';
import FilterGroup from './FilterGroup';
import PriceRangeFilter from './PriceRangeFilter';
import '../product/VariantSelector.css';
import './FilterSidebar.css';

// Panel de filtros del catálogo.
// opciones: { categorias: [{ nombre, cantidad }], talles: [], colores: [{ nombre, hex }], precio: { min, max } }
// filtros:  { categoria: [], talle: [], color: [], min, max, stock }
const FilterSidebar = ({ opciones, filtros, onToggle, onPrecio, onStock, onClear }) => (
  <aside className="filters" aria-label="Filtros">
    <div className="filters__header">
      <h2 className="filters__title">Filtrar</h2>
      <button type="button" className="link" onClick={onClear}>
        Limpiar
      </button>
    </div>

    <FilterGroup title="Categoría">
      <ul className="filters__list">
        {opciones.categorias.map((cat) => (
          <li key={cat.nombre}>
            <Checkbox
              checked={filtros.categoria.includes(cat.nombre)}
              onChange={() => onToggle('categoria', cat.nombre)}
              extra={`(${cat.cantidad})`}
            >
              {cat.nombre}
            </Checkbox>
          </li>
        ))}
      </ul>
    </FilterGroup>

    <FilterGroup title="Talle">
      <div className="variant__options">
        {opciones.talles.map((talle) => (
          <button
            key={talle}
            type="button"
            className={`size-btn filters__size ${filtros.talle.includes(talle) ? 'size-btn--active' : ''}`}
            aria-pressed={filtros.talle.includes(talle)}
            onClick={() => onToggle('talle', talle)}
          >
            {talle}
          </button>
        ))}
      </div>
    </FilterGroup>

    <FilterGroup title="Color">
      <div className="variant__options">
        {opciones.colores.map((color) => (
          <button
            key={color.nombre}
            type="button"
            className={`swatch ${filtros.color.includes(color.nombre) ? 'swatch--active' : ''}`}
            aria-pressed={filtros.color.includes(color.nombre)}
            aria-label={color.nombre}
            title={color.nombre}
            onClick={() => onToggle('color', color.nombre)}
          >
            <span style={{ background: color.hex }} />
          </button>
        ))}
      </div>
      {filtros.color.length > 0 && <p className="filters__note">{filtros.color.join(' · ')}</p>}
    </FilterGroup>

    <FilterGroup title="Precio">
      <PriceRangeFilter
        key={`${filtros.min}-${filtros.max}`}
        min={filtros.min}
        max={filtros.max}
        limites={opciones.precio}
        onApply={onPrecio}
      />
    </FilterGroup>

    <FilterGroup title="Disponibilidad">
      <Checkbox checked={filtros.stock} onChange={(e) => onStock(e.target.checked)}>
        Solo productos en stock
      </Checkbox>
    </FilterGroup>
  </aside>
);

export default FilterSidebar;
