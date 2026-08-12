import { FadeIn } from "@/components/motion/fade-in";
import { Container, SectionLabel } from "@/components/ui/container";
import { technology } from "@/lib/technology";

export function TechnologySection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionLabel>08 — Technology</SectionLabel>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold text-slate-950">
            A practical stack, grouped the way we actually work.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            We pick tools that fit the product. This list is the stack LoopC uses and supports —
            editable from configuration, not a logo wall.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {technology.map((group) => (
            <div key={group.id} className="rounded-2xl border border-slate-200 bg-[#f4f6fa] p-5">
              <h3 className="text-sm font-semibold text-slate-900">{group.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
