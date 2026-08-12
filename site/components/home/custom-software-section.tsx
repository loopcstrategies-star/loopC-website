import { MagneticButton } from "@/components/motion/magnetic-button";
import { FadeIn } from "@/components/motion/fade-in";
import { Container, SectionLabelLight } from "@/components/ui/container";
import { customSoftwareCapabilities } from "@/lib/process";

export function CustomSoftwareSection() {
  return (
    <section className="relative overflow-hidden bg-[#070d1a] py-20 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="grain-overlay" />
      <Container className="relative">
        <FadeIn>
          <SectionLabelLight>04 — Custom software</SectionLabelLight>
          <h2 className="type-h2 mt-3 max-w-3xl font-bold">
            When standard software doesn’t fit, build what does.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Every business has different workflows. LoopC designs systems around those
            workflows instead of asking the business to become a generic template.
          </p>
        </FadeIn>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customSoftwareCapabilities.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <MagneticButton href="/contact?service=custom-software">
            Discuss Your Requirement
          </MagneticButton>
        </div>
      </Container>
    </section>
  );
}
