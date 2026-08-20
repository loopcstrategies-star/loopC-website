import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getExpertCta, getExploreErpCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

export function HomeFinalCta() {
  const erpCta = getExploreErpCta();
  const expertCta = getExpertCta();

  return (
    <section className="section-dark relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="grain-overlay" />
      <Container className="relative">
        <FadeIn>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center sm:px-12">
            <SectionHeader
              eyebrow="Next step"
              title={siteConfig.positioning.finalCtaHeadline}
              description={siteConfig.positioning.finalCtaCopy}
              light
              align="center"
              className="mx-auto"
            />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <MagneticButton href={erpCta.href}>{erpCta.label}</MagneticButton>
              <MagneticButton href={expertCta.href} variant="secondary">
                {expertCta.label}
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

export function TrustProofSection() {
  const project = "Coacher Max";

  return (
    <section className="section-light py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Trust"
            title="Built around real business needs."
            description="We do not publish placeholder quotes or invented metrics. Trust comes from how we work and what we have shipped."
          />
        </FadeIn>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          <li className="lift-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="font-semibold text-slate-900">Process you can follow</p>
            <p className="mt-2 text-sm text-slate-600">
              Strategy → UX → UI → development → testing → launch → support.
            </p>
          </li>
          <li className="lift-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="font-semibold text-slate-900">Based in Chennai</p>
            <p className="mt-2 text-sm text-slate-600">{siteConfig.location.display}</p>
          </li>
          <li className="lift-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="font-semibold text-slate-900">A live product</p>
            <p className="mt-2 text-sm text-slate-600">
              {project} is in production — proof we build and run software, not only pitch it.
            </p>
          </li>
        </ul>
      </Container>
    </section>
  );
}
