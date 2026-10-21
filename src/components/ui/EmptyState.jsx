import './EmptyState.css';

const EmptyState = ({ icon, title, text, children }) => (
  <div className="empty-state">
    {icon && <div className="empty-state__icon">{icon}</div>}
    <h2 className="empty-state__title display">{title}</h2>
    {text && <p className="empty-state__text">{text}</p>}
    {children && <div className="empty-state__actions">{children}</div>}
  </div>
);

export default EmptyState;
