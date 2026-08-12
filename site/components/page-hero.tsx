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
      <section className="relative overflow-hidden bg-[#050b16] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="grain-overlay" />
        <Container className="relative">
          {eyebrow ? <p className="type-label text-teal-300/90">{eyebrow}</p> : null}
          <h1 className="type-h1 mt-3 max-w-3xl font-bold text-white">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {description}
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-b border-slate-200/80 bg-[#f4f6fa] py-16 sm:py-20">
      <Container>
        {eyebrow ? <p className="type-label text-teal-700">{eyebrow}</p> : null}
        <h1 className="type-h1 mt-3 max-w-3xl font-bold text-slate-950">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
