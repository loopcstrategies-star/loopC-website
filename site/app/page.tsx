import type { Metadata } from "next";
import { CustomSoftwareSection } from "@/components/home/custom-software-section";
import { HomeHero } from "@/components/home/home-hero";
import { HomePricingPreview } from "@/components/home/home-pricing-preview";
import { IndustriesSection } from "@/components/home/industries-section";
import { ProcessSection } from "@/components/home/process-section";
import { ProductShowcases } from "@/components/home/product-showcases";
import { ProductStory } from "@/components/home/product-story";
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
  getErpPublicUrl,
  sectionByKey,
} from "@/lib/erp-api";
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
  const erp = getErpPublicUrl();
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
    typeof heroJson.secondaryCtaLabel === "string" ? heroJson.secondaryCtaLabel : "Talk to Us";
  const secondaryCtaHref =
    typeof heroJson.secondaryCtaHref === "string" ? heroJson.secondaryCtaHref : "/contact";

  return (
    <div>
      <JsonLd data={getOrganizationSchema()} />
      <HomeHero
        title={hero?.title || siteData?.site?.tagline || siteConfig.tagline}
        subtitle={hero?.subtitle || siteConfig.supportingLine}
        ctaLabel={hero?.ctaLabel || "Explore ERP"}
        ctaHref={hero?.ctaHref || `${erp}/pricing`}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaHref={secondaryCtaHref}
        pills={
          asStringArray(heroJson.pills).length
            ? asStringArray(heroJson.pills)
            : undefined
        }
      />
      <ServicesSection services={servicesData?.services} />
      <HomePricingPreview plans={plansData?.plans} />
      <ProcessSection />
      <ProductStory />
      <CustomSoftwareSection />
      <ProductShowcases />
      <TechnologySection />
      <IndustriesSection />
      <WorkProofCta />
    </div>
  );
}
