import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent" | "trial" | "pastDue";

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  accent: "bg-[var(--accent)] text-white border-transparent",
  trial: "bg-blue-50 text-blue-700 border-blue-100",
  pastDue: "bg-violet-50 text-violet-700 border-violet-100",
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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function subscriptionTone(status: string): Tone {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "TRIAL":
      return "trial";
    case "PAST_DUE":
      return "pastDue";
    case "CANCELLED":
    case "EXPIRED":
    case "SUSPENDED":
      return "danger";
    case "PENDING":
      return "warning";
    default:
      return "neutral";
  }
}
