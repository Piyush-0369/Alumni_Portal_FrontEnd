import clsx from "clsx";

export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold btn-transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 focus:ring-primary-600",
    ghost: "bg-transparent text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]",
    danger: "bg-danger text-white hover:brightness-95"
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
