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
    <section className="border-y border-[var(--border)] bg-white py-8">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Technology we ship with
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {tech.map((item) => (
            <li
              key={item}
              className="text-sm font-semibold text-slate-500 transition hover:text-[var(--primary)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
