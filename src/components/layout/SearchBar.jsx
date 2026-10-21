import { useId, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IconSearch } from '../ui/Icons';

// Busca en el catálogo: navega a /productos?q=...
const SearchBar = ({ onSearch }) => {
  const [searchParams] = useSearchParams();
  const [texto, setTexto] = useState(searchParams.get('q') ?? '');
  const navigate = useNavigate();
  const inputId = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = texto.trim();
    navigate(q ? `/productos?q=${encodeURIComponent(q)}` : '/productos');
    onSearch?.();
  };

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <IconSearch size={16} />
      <label htmlFor={inputId} className="visually-hidden">
        Buscar productos
      </label>
      <input
        id={inputId}
        type="search"
        placeholder="Buscar en ViralOutfits"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
