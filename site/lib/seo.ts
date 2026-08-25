import type { Metadata } from "next";
import type { Industry } from "@/lib/industries";
import type { Project } from "@/lib/projects";
import type { Service } from "@/lib/services";
import { getPublishedEmail, getSiteUrl, isPublished, siteConfig } from "@/lib/site-config";

export const defaultSiteTitle =
  "LoopC Business Strategies | Enterprise ERP & Business Technology";

export const defaultSiteDescription =
  "LoopC Business Strategies provides business technology solutions and subscription-based ERP software, along with web, mobile and custom SaaS solutions for modern businesses.";

export const homePageTitle =
  "LoopC Business Strategies | Enterprise ERP & Business Technology";

export const homePageDescription =
  "LoopC Business Strategies provides business technology solutions and subscription-based ERP software, along with web, mobile and custom SaaS solutions for modern businesses.";

export const openGraphTitle = "LoopC Business Strategies";

export const openGraphDescription =
  "LoopC Business Strategies provides business technology solutions and subscription-based ERP software, along with web, mobile and custom SaaS solutions for modern businesses.";

/** Unique SEO copy for static public marketing pages. */
export const pageSeo = {
  home: {
    title: homePageTitle,
    description: homePageDescription,
  },
  about: {
    title: "About LoopC Business Strategies | Business Technology & Software",
    description:
      "Learn how LoopC designs practical, scalable digital products — from discovery to long-term support for growing businesses.",
  },
  services: {
    title: "Software Development Services | LoopC Business Strategies",
    description:
      "Web, mobile, SaaS, ERP customization, dashboards and business automation — digital solutions built around your goals.",
  },
  erp: {
    title: "LoopC ERP | Connected Business Management Platform",
    description:
      "Run finance, sales, inventory, CRM, HR and reporting in one connected ERP — web and mobile for everyday operations.",
  },
  pricing: {
    title: "LoopC ERP Pricing | Business Management Plans",
    description:
      "Transparent INR plans for LoopC ERP — Starter, Business, Professional and Enterprise. Upgrade modules as you grow.",
  },
  contact: {
    title: "Contact LoopC Business Strategies | Build Your Business Solution",
    description:
      "Tell us about your project or ERP needs. We respond with a clear next step for custom software or LoopC ERP.",
  },
  features: {
    title: "LoopC ERP Features | Modules for Everyday Operations",
    description:
      "Explore LoopC ERP modules for accounting, inventory, CRM, HR, payroll and reporting in one connected platform.",
  },
  solutions: {
    title: "Business Software Solutions | LoopC Business Strategies",
    description:
      "ERP, custom software, web apps and automation solutions that replace disconnected tools with systems that fit how you work.",
  },
  work: {
    title: "Our Work | Selected LoopC Product Stories",
    description:
      "Selected LoopC work and live products we stand behind — practical software built for real business operations.",
  },
  industries: {
    title: "Industries We Serve | ERP & Custom Software",
    description:
      "LoopC delivers ERP and custom software for trading, wholesale, distribution and other growing Indian businesses.",
  },
  privacy: {
    title: "Privacy Policy | LoopC Business Strategies",
    description:
      "How LoopC Business Strategies collects, uses and protects information when you use our website and related services.",
  },
  terms: {
    title: "Terms of Use | LoopC Business Strategies",
    description:
      "Terms that govern use of the LoopC Business Strategies website and related public marketing materials.",
  },
  brochure: {
    title: "Company Brochure | LoopC Business Strategies",
    description:
      "Overview of LoopC ERP and custom software services — print-friendly brochure for teams evaluating LoopC.",
  },
  blog: {
    title: "Blog & Insights | LoopC Business Strategies",
    description:
      "Articles on ERP, custom software and operations — published by LoopC Business Strategies.",
  },
  cookies: {
    title: "Cookie Policy | LoopC Business Strategies",
    description:
      "How LoopC Business Strategies uses cookies and similar technologies on the public website.",
  },
  benefits: {
    title: "LoopC ERP Benefits | Why Teams Choose LoopC",
    description:
      "Practical benefits of LoopC ERP for growing businesses — connected operations, modular plans and clear subscription access.",
  },
} as const;

export const sitemapPaths = [
  "/",
  "/about",
  "/services",
  "/solutions",
  "/erp",
  "/features",
  "/benefits",
  "/pricing",
  "/work",
  "/industries",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
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
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  index?: boolean;
}): Metadata {
  const url = getAbsoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
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

export function getFaqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  featuredImageUrl?: string | null;
}) {
  const url = getAbsoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    url,
    mainEntityOfPage: url,
    datePublished: post.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: post.authorName || siteConfig.legalName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: getSiteUrl(),
    },
    image: post.featuredImageUrl || getAbsoluteUrl("/opengraph-image"),
  };
}

/** Marketing schema for LoopC ERP product page — no fake ratings. */
export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LoopC ERP",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: pageSeo.erp.description,
    url: getAbsoluteUrl("/erp"),
    offers: {
      "@type": "Offer",
      url: getAbsoluteUrl("/pricing"),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: getSiteUrl(),
    },
  };
}

export function getIndustryDescription(industry: Industry): string {
  return `${industry.summary} LoopC delivers ERP and custom software for ${industry.title.toLowerCase()} businesses.`;
}

export function getProjectDescription(project: Project): string {
  return project.summary;
}
