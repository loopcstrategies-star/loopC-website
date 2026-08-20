import type { Metadata } from "next";
import { insightAuthor, type InsightPost } from "@/lib/insights";
import type { Industry } from "@/lib/industries";
import type { Project } from "@/lib/projects";
import type { Service } from "@/lib/services";
import { getPublishedEmail, getSiteUrl, isPublished, siteConfig } from "@/lib/site-config";

export const seoKeywords = [
  "ERP software India",
  "custom ERP development",
  "business software company Chennai",
  "SaaS development",
  "ERP customization",
  "business dashboard development",
  "custom business software",
  "web application development Chennai",
  "mobile app development Chennai",
  "LoopC ERP",
] as const;

export const defaultSiteTitle =
  "LoopC Business Strategies | ERP & Custom Business Software";

export const defaultSiteDescription =
  "LoopC builds LoopC ERP and custom business software — web applications, mobile apps, dashboards and integrations for growing companies.";

export const homePageTitle =
  "LoopC | ERP & Custom Business Software";

export const homePageDescription = siteConfig.supportingLine;

export const openGraphTitle = "LoopC Business Strategies";

export const openGraphDescription =
  "LoopC ERP plus custom web, mobile and dashboard software — built around the way your business works.";

export const sitemapPaths = [
  "/",
  "/about",
  "/services",
  "/solutions",
  "/erp",
  "/features",
  "/pricing",
  "/work",
  "/blog",
  "/faq",
  "/industries",
  "/contact",
  "/privacy",
  "/terms",
  "/brochure",
] as const;

export function getAbsoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  return path === "/" ? base : `${base}${path}`;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = getAbsoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_IN",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: openGraphTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function getOrganizationSchema() {
  const email = getPublishedEmail();
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    name: siteConfig.legalName,
    legalName: siteConfig.legalName,
    url: getSiteUrl(),
    description: siteConfig.description,
    areaServed: {
      "@type": "City",
      name: "Chennai",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
      streetAddress: siteConfig.location.area,
    },
  };

  if (email) schema.email = email;
  if (isPublished(siteConfig.phoneTel)) schema.telephone = siteConfig.phoneTel;

  const sameAs = Object.values(siteConfig.social).filter(isPublished);
  if (sameAs.length) schema.sameAs = sameAs;

  return schema;
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: getSiteUrl(),
    },
  };
}

export function getServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: getAbsoluteUrl(service.href),
    provider: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: getSiteUrl(),
    },
    areaServed: {
      "@type": "City",
      name: "Chennai",
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

export function getArticleSchema(post: InsightPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: insightAuthor,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: getSiteUrl(),
    },
    mainEntityOfPage: getAbsoluteUrl(`/insights/${post.slug}`),
  };
}

export function getIndustryDescription(industry: Industry): string {
  return `${industry.summary} LoopC delivers ERP and custom software for ${industry.title.toLowerCase()} businesses.`;
}

export function getProjectDescription(project: Project): string {
  return project.summary;
}
