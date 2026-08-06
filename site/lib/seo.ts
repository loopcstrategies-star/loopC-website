import { getSiteUrl, siteConfig } from "@/lib/site-config";

export const seoKeywords = [
  "Custom Software Development",
  "Business Solutions Consulting",
  "Web Development India",
  "Mobile App Development",
  "ERP Software",
  "LoopC ERP",
  "SaaS Development",
  "Next.js Development",
  "Flutter Apps",
] as const;

export const defaultSiteTitle =
  "LoopC | Business Strategy → Software That Runs It";

export const defaultSiteDescription =
  "We understand your business first, then build the software — websites, mobile apps, and LoopC ERP with transparent plans.";

export const homePageTitle =
  "LoopC — We Understand Your Business First, Then We Build the Software";

export const homePageDescription =
  "Business consulting, custom web and mobile development, and LoopC ERP — a software house that owns its product.";

export const openGraphTitle = "LoopC Business Strategies";

export const openGraphDescription =
  "Turn business bottlenecks into software — web, mobile, and ERP.";

/** Public routes included in sitemap.xml */
export const sitemapPaths = [
  "/",
  "/services",
  "/erp",
  "/erp/pricing",
  "/work",
  "/work/coacher-max",
  "/about",
  "/blog",
  "/contact",
  "/free-demo",
  "/free-audit",
  "/free-consultation",
  "/download-brochure",
  "/features",
  "/industries",
  "/pricing",
] as const;

export function getAbsoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  return path === "/" ? base : `${base}${path}`;
}

export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LoopC ERP",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Basic, Standard, and Premium plans — quote on demo",
    },
    description: openGraphDescription,
    url: getAbsoluteUrl("/erp"),
    provider: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: getSiteUrl(),
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: getSiteUrl(),
    email: siteConfig.contactEmail,
    telephone: siteConfig.phoneTel,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
  };
}
