import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { projects } from "@/lib/projects";

export function WorkProofCta() {
  const project = projects[0];

  return (
    <section className="section-white py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Work"
            title="Software we have built and shipped."
            description="We only publish work we can stand behind — real products in production, not fictional case studies."
          />
        </FadeIn>
        {project ? (
          <FadeIn delay={0.06}>
            <Link
              href={project.href}
              className="lift-card mt-12 grid overflow-hidden rounded-3xl border border-slate-200/80 bg-[#f4f6fa] lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="p-6 sm:p-10">
                <p className="type-label text-[var(--primary)]">{project.sector}</p>
                <h3 className="type-h2 mt-3 font-bold text-slate-950">{project.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">{project.summary}</p>
                <p className="mt-6 text-sm font-semibold text-[var(--primary)]">Read the case study →</p>
              </div>
              <div className="on-dark relative min-h-[16rem] border-t border-slate-200/80 bg-[#050b16] p-6 lg:border-l lg:border-t-0">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">Product snapshot</p>
                  <p className="mt-2 text-sm text-slate-300">{project.galleryNote}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.technology.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-300"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          </FadeIn>
        ) : null}
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/work" className="font-semibold text-[var(--primary)] hover:underline">
            View all work →
          </Link>
        </p>
      </Container>
    </section>
  );
}
