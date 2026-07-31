export default function PageLoader({ label = "Loading…", compact = false }) {
  return (
    <div
      className={`panel workspace-loading${compact ? " compact" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
