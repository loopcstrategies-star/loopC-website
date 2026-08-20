import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Container, SectionLabelLight } from "@/components/ui/container";
import { industries } from "@/lib/industries";

export function IndustriesSection() {
  return (
    <section className="bg-[#050b16] py-20 text-white sm:py-24">
      <Container>
        <FadeIn>
          <SectionLabelLight>09 — Industries</SectionLabelLight>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold">
            Technology that understands the business behind it.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            We build software for how these operations actually run. Each card is a starting
            point — not a claim of exclusive vertical expertise.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className="lift-card rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h3 className="font-semibold text-white">{industry.title}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-blue-300">Problem</dt>
                  <dd className="text-slate-300">{industry.problem}</dd>
                </div>
                <div>
                  <dt className="text-blue-300">Solution</dt>
                  <dd className="text-slate-300">{industry.solution}</dd>
                </div>
                <div>
                  <dt className="text-blue-300">Outcome</dt>
                  <dd className="text-slate-300">{industry.outcome}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
