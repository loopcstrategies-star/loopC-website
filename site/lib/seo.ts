import { getSiteUrl, siteConfig } from "@/lib/site-config";

export const seoKeywords = [
  "Custom Software Development",
  "Web Application Development",
  "Mobile App Development",
  "ERP Software",
  "LoopC ERP",
  "Business Software",
  "SaaS Development",
  "UI UX Design",
  "Software Testing QA",
] as const;

export const defaultSiteTitle =
  "LoopC | Digital Systems for Business — Web, Mobile & ERP";

export const defaultSiteDescription =
  "LoopC builds web applications, mobile apps, ERP platforms and custom software — from idea to launch and support.";

export const homePageTitle =
  "LoopC — Software & Business Systems Built Around How You Work";

export const homePageDescription =
  "Your business has a way of working. Your software should too. Web, mobile, ERP and custom software — one partner from idea to launch.";

export const openGraphTitle = "LoopC Business Strategies";

export const openGraphDescription =
  "Web applications. Mobile apps. ERP platforms. Custom software. One technology partner from idea to launch.";

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
