import Image from "next/image";
import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  description,
  dark = false,
  backgroundImage,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  dark?: boolean;
  backgroundImage?: string;
}) {
  const label = eyebrow;

  if (dark) {
    return (
      <section className="page-hero section-dark on-dark relative overflow-hidden bg-[var(--dark)] py-16 sm:py-24">
        {backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--dark)] via-[var(--dark)]/88 to-[var(--dark)]/55"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-[var(--dark)]/35" aria-hidden />
          </>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <div className="hero-mesh pointer-events-none absolute inset-0 opacity-55" />
            <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          </>
        )}
        <div className="grain-overlay" />
        <Container className="relative">
          {label ? (
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-200 shadow-sm shadow-blue-500/10">
              {label}
            </p>
          ) : null}
          <h1 className="type-h1 mt-5 max-w-3xl font-bold text-white">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {description}
          </p>
        </Container>
        <div className="page-hero-accent" aria-hidden />
      </section>
    );
  }

  return (
    <section className="page-hero relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)] py-16 sm:py-24">
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/90 to-[var(--background)]/70"
            aria-hidden
          />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 30% 40%, black 20%, transparent 75%)",
              }}
            />
          </div>
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
        </>
      )}
      <Container className="relative">
        {label ? (
          <p className="inline-flex rounded-full border border-blue-200/60 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[var(--primary)] shadow-sm shadow-blue-500/5">
            {label}
          </p>
        ) : null}
        <h1 className="type-h1 mt-5 max-w-3xl font-bold text-[var(--text)]">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {description}
        </p>
      </Container>
      <div className="page-hero-accent opacity-70" aria-hidden />
    </section>
  );
}
