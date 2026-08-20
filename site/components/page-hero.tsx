import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  if (dark) {
    return (
      <section className="section-dark on-dark relative overflow-hidden bg-[var(--dark)] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="grain-overlay" />
        <Container className="relative">
          {eyebrow ? <p className="type-label text-blue-300/90">{eyebrow}</p> : null}
          <h1 className="type-h1 mt-3 max-w-3xl font-bold text-white">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {description}
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)] py-16 sm:py-20">
      <Container>
        {eyebrow ? <p className="type-label text-[var(--primary)]">{eyebrow}</p> : null}
        <h1 className="type-h1 mt-3 max-w-3xl font-bold text-[var(--text)]">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
