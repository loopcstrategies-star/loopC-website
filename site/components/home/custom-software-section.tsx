import { MagneticButton } from "@/components/motion/magnetic-button";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getCustomSoftwareCta } from "@/lib/navigation";
import { customSoftwareCapabilities } from "@/lib/process";
import { siteConfig } from "@/lib/site-config";

export function CustomSoftwareSection() {
  const customCta = getCustomSoftwareCta();

  return (
    <section className="section-dark on-dark relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="grain-overlay" />
      <Container className="relative">
        <FadeIn>
          <SectionHeader
            eyebrow="Custom software"
            title={siteConfig.positioning.customSoftwareHeadline}
            description={siteConfig.positioning.customSoftwareCopy}
            light
          />
        </FadeIn>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customSoftwareCapabilities.map((item, index) => (
            <FadeIn key={item} delay={index * 0.03}>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </li>
            </FadeIn>
          ))}
        </ul>

        <div className="mt-10">
          <MagneticButton href={customCta.href}>{customCta.label}</MagneticButton>
        </div>
      </Container>
    </section>
  );
}
