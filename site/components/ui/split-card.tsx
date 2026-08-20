import Link from "next/link";
import { MagneticButton } from "@/components/motion/magnetic-button";

export function SplitCard({
  eyebrow,
  title,
  description,
  points,
  href,
  ctaLabel,
  variant = "light",
}: {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  href: string;
  ctaLabel: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <article
      className={`lift-card flex h-full flex-col rounded-3xl border p-6 sm:p-8 ${
        isDark
          ? "border-white/10 bg-white/5 text-white"
          : "border-slate-200/80 bg-white text-slate-950 shadow-sm"
      }`}
    >
      <p className={`type-label ${isDark ? "text-blue-300" : "text-[var(--primary)]"}`}>{eyebrow}</p>
      <h3 className="type-h3 mt-3 font-semibold">{title}</h3>
      <p className={`mt-3 flex-1 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        {description}
      </p>
      <ul className={`mt-5 space-y-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className={isDark ? "text-teal-400" : "text-[var(--primary)]"} aria-hidden>
              —
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <MagneticButton href={href} variant={isDark ? "secondary" : "primary"}>
          {ctaLabel}
        </MagneticButton>
      </div>
    </article>
  );
}

export function PremiumCard({
  title,
  description,
  href,
  linkLabel,
  icon,
}: {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  icon?: React.ReactNode;
}) {
  const body = (
    <>
      {icon ? (
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[var(--primary)]">
          {icon}
        </div>
      ) : null}
      <h3 className="type-h3 mt-4 font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      {href && linkLabel ? (
        <span className="mt-4 inline-block text-sm font-semibold text-[var(--primary)]">{linkLabel}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="lift-card block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        {body}
      </Link>
    );
  }

  return (
    <div className="lift-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      {body}
    </div>
  );
}
