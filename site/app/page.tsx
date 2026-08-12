import type { Metadata } from "next";
import { CustomSoftwareSection } from "@/components/home/custom-software-section";
import { HomeHero } from "@/components/home/home-hero";
import { IndustriesSection } from "@/components/home/industries-section";
import { ProcessSection } from "@/components/home/process-section";
import { ProductShowcases } from "@/components/home/product-showcases";
import { ProductStory } from "@/components/home/product-story";
import { ServicesSection } from "@/components/home/services-section";
import { TechnologySection } from "@/components/home/technology-section";
import { WorkProofCta } from "@/components/home/work-proof-cta";
import { JsonLd } from "@/components/json-ld";
import { getOrganizationSchema, homePageDescription, homePageTitle, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: homePageTitle,
    description: homePageDescription,
    path: "/",
  }),
  title: { absolute: homePageTitle },
};

export default function HomePage() {
  return (
    <div>
      <JsonLd data={getOrganizationSchema()} />
      <HomeHero />
      <ServicesSection />
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
