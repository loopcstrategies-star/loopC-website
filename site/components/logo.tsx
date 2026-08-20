import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  className?: string;
  /** `footer` = light text for dark footer background */
  variant?: "default" | "footer";
};

export function Logo({ className = "", variant = "default" }: LogoProps) {
  const isFooter = variant === "footer";
  const loopColor = isFooter ? "text-white" : "text-slate-900";
  const subColor = isFooter ? "text-slate-400" : "text-slate-600";
  /** Gradient “C”: blue → violet (default); brighter on dark footer */
  const cGradient = isFooter
    ? "bg-gradient-to-b from-blue-300 via-violet-300 to-cyan-300"
    : "bg-gradient-to-b from-blue-500 via-violet-500 to-cyan-500";

  const brand = siteConfig.brand;
  const loopLetters = brand.length > 1 ? brand.slice(0, -1) : brand;
  const lastLetter = brand.length > 1 ? brand.slice(-1) : "";

  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      title={siteConfig.name}
      className={`group inline-flex flex-col items-start gap-0.5 py-1 font-[family-name:var(--font-display)] transition hover:opacity-90 ${className}`}
    >
      <span className="flex items-baseline text-[1.35rem] font-bold leading-none tracking-tight sm:text-2xl">
        <span className={loopColor}>{loopLetters}</span>
        {lastLetter ? (
          <span
            className={`bg-clip-text text-transparent ${cGradient}`}
            aria-hidden
          >
            {lastLetter}
          </span>
        ) : null}
      </span>
      <span
        className={`text-[0.62rem] font-medium uppercase leading-none tracking-[0.22em] sm:text-[0.65rem] ${subColor}`}
      >
        Business Strategies
      </span>
    </Link>
  );
}
