import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitCard } from "@/components/ui/split-card";
import { getCustomSoftwareCta, getExploreErpCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

export function DualOfferingSection() {
  const erpCta = getExploreErpCta();
  const customCta = getCustomSoftwareCta();

  return (
    <section className="section-light py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Two ways to work with LoopC"
            title={siteConfig.positioning.dualOfferingHeadline}
            description="Whether you need a ready ERP platform or software built around your unique workflow, LoopC helps you choose the right path."
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.05}>
            <SplitCard
              eyebrow="LoopC ERP"
              title="Run your business from one connected system."
              description={siteConfig.positioning.erpCopy}
              points={[
                "Finance, sales, inventory and people in one workspace",
                "Subscription plans that grow with your business",
                "Web and mobile access for your team",
              ]}
              href={erpCta.href}
              ctaLabel={erpCta.label}
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <SplitCard
              eyebrow="Custom software"
              title={siteConfig.positioning.customSoftwareHeadline}
              description={siteConfig.positioning.customSoftwareCopy}
              points={[
                "Designed around your workflows and data",
                "Web, mobile, dashboards and integrations",
                "Built to evolve as your business changes",
              ]}
              href={customCta.href}
              ctaLabel={customCta.label}
            />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
