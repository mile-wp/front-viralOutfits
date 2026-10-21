import './Account.css';

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <p className="stat-card__label">{label}</p>
    <p className="stat-card__value">{value}</p>
  </div>
);

export default StatCard;
