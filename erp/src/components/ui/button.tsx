import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border-transparent",
  secondary:
    "bg-[var(--surface)] text-[var(--ink)] border-[var(--border)] hover:bg-[var(--surface-2)]",
  ghost:
    "bg-transparent text-[var(--ink)] border-transparent hover:bg-[var(--surface-2)]",
  danger:
    "bg-[var(--danger)] text-white border-transparent hover:opacity-90",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md border font-medium transition disabled:opacity-50 disabled:pointer-events-none ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
