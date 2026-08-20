import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container } from "@/components/ui/container";
import { getCustomSoftwareCta, getExploreErpCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

export function HomeFinalCta() {
  const erpCta = getExploreErpCta();
  const projectCta = getCustomSoftwareCta();

  return (
    <section className="section-dark relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="grain-overlay" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center sm:px-12">
            <p className="type-label text-blue-300">Next step</p>
            <h2 className="type-h2 mt-3 font-bold text-white">
              {siteConfig.positioning.finalCtaHeadline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              {siteConfig.positioning.finalCtaCopy}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <MagneticButton href={projectCta.href}>{projectCta.label}</MagneticButton>
              <MagneticButton href={erpCta.href} variant="dark">
                {erpCta.label}
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
