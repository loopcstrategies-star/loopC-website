import type { Metadata } from "next";
import {
  ErpShowcaseSection,
  WhyChooseUsSection,
} from "@/components/home/erp-showcase-section";
import { HomeFinalCta } from "@/components/home/home-final-cta";
import { HomeHero } from "@/components/home/home-hero";
import { HomePricingPreview } from "@/components/home/home-pricing-preview";
import { IntroCardsSection } from "@/components/home/intro-cards-section";
import { DigitalProductsSection } from "@/components/home/digital-products-section";
import { ProcessSection } from "@/components/home/process-section";
import { TechStripSection } from "@/components/home/tech-strip-section";
import { JsonLd } from "@/components/json-ld";
import {
  type ErpPlan,
  type ErpWebsitePage,
  asStringArray,
  erpFetch,
  sectionByKey,
} from "@/lib/erp-api";
import { getCustomSoftwareCta, getExploreErpCta } from "@/lib/navigation";
import { getOrganizationSchema, pageMetadata, pageSeo } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: pageSeo.home.title,
    description: pageSeo.home.description,
    path: "/",
  }),
  title: { absolute: pageSeo.home.title },
};

type SitePayload = {
  site?: { siteName?: string | null; tagline?: string | null } | null;
  home?: ErpWebsitePage | null;
};

type PlansPayload = { plans: ErpPlan[] };

export default async function HomePage() {
  const erpCta = getExploreErpCta();
  const customCta = getCustomSoftwareCta();
  const [siteData, plansData] = await Promise.all([
    erpFetch<SitePayload>("/api/public/site"),
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
      : erpCta.label;
  const secondaryCtaHref =
    typeof heroJson.secondaryCtaHref === "string" ? heroJson.secondaryCtaHref : erpCta.href;

  return (
    <div>
      <JsonLd data={getOrganizationSchema()} />
      <HomeHero
        title={hero?.title || siteData?.site?.tagline || siteConfig.tagline}
        subtitle={hero?.subtitle || siteConfig.supportingLine}
        ctaLabel={hero?.ctaLabel || customCta.label}
        ctaHref={hero?.ctaHref || customCta.href}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaHref={secondaryCtaHref}
        pills={asStringArray(heroJson.pills).length ? asStringArray(heroJson.pills) : undefined}
      />
      <TechStripSection />
      <IntroCardsSection />
      <DigitalProductsSection />
      <ErpShowcaseSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <HomePricingPreview plans={plansData?.plans} />
      <HomeFinalCta />
    </div>
  );
}
