import { useId, useState } from 'react';
import './Tabs.css';

// tabs: [{ id, label, content }]
const Tabs = ({ tabs }) => {
  const [activa, setActiva] = useState(tabs[0]?.id);
  const baseId = useId();
  const tabActiva = tabs.find((t) => t.id === activa) ?? tabs[0];

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-${tab.id}`}
            aria-selected={tab.id === tabActiva.id}
            className={`tabs__tab ${tab.id === tabActiva.id ? 'tabs__tab--active' : ''}`}
            onClick={() => setActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs__panel" role="tabpanel" aria-labelledby={`${baseId}-${tabActiva.id}`}>
        {tabActiva.content}
      </div>
    </div>
  );
};

export default Tabs;
