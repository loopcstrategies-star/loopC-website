import type { Metadata } from "next";
import {
  ErpShowcaseSection,
  ErpValueProps,
} from "@/components/home/erp-showcase-section";
import { HomeFinalCta } from "@/components/home/home-final-cta";
import { HomeHero } from "@/components/home/home-hero";
import { HomePricingPreview } from "@/components/home/home-pricing-preview";
import { IntroCardsSection } from "@/components/home/intro-cards-section";
import { DigitalProductsSection } from "@/components/home/digital-products-section";
import { ProcessSection } from "@/components/home/process-section";
import { JsonLd } from "@/components/json-ld";
import {
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
      <IntroCardsSection />
      <DigitalProductsSection />
      <ErpShowcaseSection />
      <ErpValueProps />
      <ProcessSection />
      <HomePricingPreview plans={plansData?.plans} />
      <HomeFinalCta />
    </div>
  );
}
