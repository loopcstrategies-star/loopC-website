import { Container } from "@/components/ui/container";

const tech = [
  "Next.js",
  "React Native",
  "Node.js",
  "PostgreSQL",
  "TypeScript",
  "Cloud",
  "REST APIs",
  "Automation",
];

export function TechStripSection() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-white py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Technology we ship with
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {tech.map((item) => (
            <li
              key={item}
              className="rounded-full border border-slate-200/80 bg-[var(--background)] px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300/60 hover:text-[var(--primary)] hover:shadow-md hover:shadow-blue-500/10"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
