export default function Input({ label, className = "", ...props }) {
  return (
    <label className={`block text-sm ${className}`}>
      {label && <span className="text-xs text-[var(--color-neutral-700)]">{label}</span>}
      <input
        {...props}
        className="mt-1 block w-full rounded-md border border-[var(--color-neutral-200)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary-600)] focus:ring-2 focus:ring-primary-600/20"
      />
    </label>
  );
}
