import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container, SectionLabel } from "@/components/ui/container";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";
import { testimonials } from "@/lib/testimonials";

export function WorkProofCta() {
  const project = projects[0];

  return (
    <>
      <section className="bg-[#f4f6fa] py-20 sm:py-24">
        <Container>
          <FadeIn>
            <SectionLabel>10 — Work</SectionLabel>
            <h2 className="type-h2 mt-3 font-bold text-slate-950">What we have built.</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              We only publish work we can stand behind. Coacher Max is a LoopC product in
              production — not a fictional case study.
            </p>
          </FadeIn>
          {project ? (
            <Link
              href={project.href}
              className="lift-card mt-10 block rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <p className="type-label text-teal-700">{project.sector}</p>
              <h3 className="type-h3 mt-3 font-semibold text-slate-950">{project.title}</h3>
              <p className="mt-3 max-w-2xl text-slate-600">{project.summary}</p>
              <p className="mt-5 text-sm font-semibold text-teal-700">Read the case study</p>
            </Link>
          ) : null}
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <FadeIn>
            <SectionLabel>11 — Proof</SectionLabel>
            {testimonials.length > 0 ? (
              <>
                <h2 className="type-h2 mt-3 font-bold text-slate-950">What clients say.</h2>
                <ul className="mt-8 grid gap-4 md:grid-cols-2">
                  {testimonials.map((item) => (
                    <li key={item.name} className="rounded-2xl border border-slate-200 p-5">
                      <blockquote className="text-slate-700">“{item.quote}”</blockquote>
                      <p className="mt-4 text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        {item.role}, {item.company}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h2 className="type-h2 mt-3 max-w-2xl font-bold text-slate-950">
                  Built around real business needs.
                </h2>
                <p className="mt-4 max-w-2xl text-slate-600">
                  We do not publish placeholder quotes. Trust comes from how we work: discovery
                  before screens, software that matches the workflow, and a team that stays after
                  launch.
                </p>
                <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-2xl border border-slate-200 bg-[#f4f6fa] p-5">
                    <p className="font-semibold text-slate-900">Process you can follow</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Strategy → UX → UI → development → testing → launch → support.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-slate-200 bg-[#f4f6fa] p-5">
                    <p className="font-semibold text-slate-900">Based in Chennai</p>
                    <p className="mt-2 text-sm text-slate-600">{siteConfig.location.display}</p>
                  </li>
                  <li className="rounded-2xl border border-slate-200 bg-[#f4f6fa] p-5">
                    <p className="font-semibold text-slate-900">A live product</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Coacher Max is in production — proof we build and run software, not only
                      pitch it.
                    </p>
                  </li>
                </ul>
              </>
            )}
          </FadeIn>
        </Container>
      </section>

      <section className="bg-[#050b16] py-16 sm:py-20">
        <Container className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center sm:px-12">
          <h2 className="type-h2 font-bold text-white">Have something worth building?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Tell us the business problem. We will tell you whether software is the right next
            step — and what that step should be.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <MagneticButton href="/contact">Start a Project</MagneticButton>
            <MagneticButton href="/about" variant="secondary">
              About LoopC
            </MagneticButton>
          </div>
        </Container>
      </section>
    </>
  );
}
