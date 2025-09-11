export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-2xl shadow-soft-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
