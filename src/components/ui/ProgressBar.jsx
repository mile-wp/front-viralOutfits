// value entre 0 y 1
const ProgressBar = ({ value, label }) => (
  <div
    className="progress"
    role="progressbar"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(value * 100)}
    style={{ height: 4, background: 'var(--gray-200)', borderRadius: 2, overflow: 'hidden' }}
  >
    <div
      style={{
        width: `${Math.min(Math.max(value, 0), 1) * 100}%`,
        height: '100%',
        background: 'var(--red)',
        transition: 'width 0.3s ease',
      }}
    />
  </div>
);

export default ProgressBar;
