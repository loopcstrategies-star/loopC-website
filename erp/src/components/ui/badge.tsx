import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]",
  success: "bg-[var(--accent-soft)] text-[var(--accent)] border-transparent",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-[var(--danger)] border-red-200",
  accent: "bg-[var(--accent)] text-white border-transparent",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function subscriptionTone(
  status: string,
): Tone {
  switch (status) {
    case "ACTIVE":
    case "TRIAL":
      return "success";
    case "PAST_DUE":
      return "warning";
    case "CANCELLED":
    case "EXPIRED":
    case "SUSPENDED":
      return "danger";
    default:
      return "neutral";
  }
}
