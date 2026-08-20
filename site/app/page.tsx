import type { Metadata } from "next";
import { CustomSoftwareSection } from "@/components/home/custom-software-section";
import { DualOfferingSection } from "@/components/home/dual-offering-section";
import {
  ErpModulesGrid,
  ErpShowcaseSection,
  ErpValueProps,
} from "@/components/home/erp-showcase-section";
import { HomeFinalCta, TrustProofSection } from "@/components/home/home-final-cta";
import { HomeHero } from "@/components/home/home-hero";
import { HomePricingPreview } from "@/components/home/home-pricing-preview";
import { IndustriesSection } from "@/components/home/industries-section";
import { ProcessSection } from "@/components/home/process-section";
import { ServicesSection } from "@/components/home/services-section";
import { TechnologySection } from "@/components/home/technology-section";
import { WorkProofCta } from "@/components/home/work-proof-cta";
import { JsonLd } from "@/components/json-ld";
import {
  type ErpCmsService,
  type ErpPlan,
  type ErpWebsitePage,
  asStringArray,
  erpFetch,
  sectionByKey,
} from "@/lib/erp-api";
import { getCustomSoftwareCta, getExploreErpCta } from "@/lib/navigation";
import { getOrganizationSchema, homePageDescription, homePageTitle, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: homePageTitle,
    description: homePageDescription,
    path: "/",
  }),
  title: { absolute: homePageTitle },
};

type SitePayload = {
  site?: { siteName?: string | null; tagline?: string | null } | null;
  home?: ErpWebsitePage | null;
};

type ServicesPayload = { services: ErpCmsService[] };
type PlansPayload = { plans: ErpPlan[] };

export default async function HomePage() {
  const erpCta = getExploreErpCta();
  const customCta = getCustomSoftwareCta();
  const [siteData, servicesData, plansData] = await Promise.all([
    erpFetch<SitePayload>("/api/public/site"),
    erpFetch<ServicesPayload>("/api/public/services"),
    erpFetch<PlansPayload>("/api/public/plans"),
  ]);

  const hero = sectionByKey(siteData?.home?.sections, "hero");
  const heroJson =
    hero?.contentJson && typeof hero.contentJson === "object"
      ? (hero.contentJson as Record<string, unknown>)
      : {};

  const secondaryCtaLabel =
    typeof heroJson.secondaryCtaLabel === "string"
      ? heroJson.secondaryCtaLabel
      : customCta.label;
  const secondaryCtaHref =
    typeof heroJson.secondaryCtaHref === "string" ? heroJson.secondaryCtaHref : customCta.href;

  return (
    <div>
      <JsonLd data={getOrganizationSchema()} />
      <HomeHero
        title={hero?.title || siteData?.site?.tagline || siteConfig.tagline}
        subtitle={hero?.subtitle || siteConfig.supportingLine}
        ctaLabel={hero?.ctaLabel || erpCta.label}
        ctaHref={hero?.ctaHref || erpCta.href}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaHref={secondaryCtaHref}
        pills={
          asStringArray(heroJson.pills).length
            ? asStringArray(heroJson.pills)
            : undefined
        }
      />
      <DualOfferingSection />
      <ErpShowcaseSection />
      <ErpModulesGrid />
      <ErpValueProps />
      <CustomSoftwareSection />
      <ServicesSection services={servicesData?.services} />
      <IndustriesSection />
      <WorkProofCta />
      <TechnologySection />
      <ProcessSection />
      <TrustProofSection />
      <HomePricingPreview plans={plansData?.plans} />
      <HomeFinalCta />
    </div>
  );
}
