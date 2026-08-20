/** Site-wide company identity. Empty contact fields stay unpublished. */

export const siteConfig = {
  brand: "LoopC",
  name: "LoopC Business Strategies",
  legalName: "LoopC Business Strategies",
  tagline: "Build Better. Operate Smarter. Grow Faster.",
  description:
    "We design and build powerful digital products for modern businesses — from custom web and mobile applications to scalable business software and complete ERP solutions.",
  supportingLine:
    "We design and build powerful digital products for modern businesses — from custom web and mobile applications to scalable business software and complete ERP solutions.",
  footerTagline:
    "Technology built around the way your business works.",
  productionUrl: "https://www.loopcstrategies.com",

  positioning: {
    eyebrow: "ERP • WEB • MOBILE • CUSTOM SOFTWARE",
    heroSupport:
      "We design and build powerful digital products for modern businesses — from custom web and mobile applications to scalable business software and complete ERP solutions.",
    erpHeadline: "One Powerful ERP for Your Entire Business.",
    erpCopy:
      "Bring your business operations together with a powerful ERP platform designed to help teams manage their everyday operations from one connected system.",
    customSoftwareHeadline: "Technology Built Around Your Business.",
    customSoftwareCopy:
      "Every business works differently. We create digital solutions around your workflows, your teams and your goals — helping you replace disconnected tools and manual processes with technology that works for your business.",
    dualOfferingHeadline: "Digital Products We Build.",
    finalCtaHeadline: "Ready to build software that works the way your business does?",
    finalCtaCopy:
      "Start with LoopC ERP or tell us about your project. We'll help you find the right path.",
  },

  location: {
    area: "OMR",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    display: "OMR, Chennai, Tamil Nadu, India",
    short: "OMR, Chennai",
  },

  /**
   * Public contact. Leave empty until verified.
   * The UI and JSON-LD omit unpublished fields.
   */
  contactEmail: "",
  salesEmail: "",
  whatsappE164: "",
  phoneDisplay: "",
  phoneTel: "",
  gstNumber: "",
  businessHours: "",

  social: {
    linkedIn: "",
    x: "",
    youTube: "",
  },

  legal: {
    lastUpdated: "2026-08-12",
    lastUpdatedDisplay: "12 August 2026",
    governingRegion: "Tamil Nadu, India",
    enquiryRetention:
      "We keep enquiry details only as long as needed to respond, and — if we work together — to deliver the engagement. We do not sell personal information.",
  },
} as const;

const PLACEHOLDER_MARKERS = [
  "placeholder",
  "919876543210",
  "9876543210",
  "+91 44 4000 0000",
  "+914440000000",
  "hello@loopc.com",
  "sales@loopc.com",
  "aaaaa0000a1z5",
  "nungambakkam",
  "example.com",
  "changeme",
  "todo",
] as const;

export function isPublished(value: string | undefined | null): value is string {
  if (!value || !value.trim()) return false;
  const normalized = value.trim().toLowerCase();
  return !PLACEHOLDER_MARKERS.some((marker) => normalized.includes(marker));
}

export function getPublishedEmail(): string | null {
  if (isPublished(siteConfig.contactEmail)) return siteConfig.contactEmail;
  if (isPublished(siteConfig.salesEmail)) return siteConfig.salesEmail;
  return null;
}

export function getWhatsAppUrl(prefill?: string): string | null {
  if (!isPublished(siteConfig.whatsappE164)) return null;
  const base = `https://wa.me/${siteConfig.whatsappE164}`;
  if (!prefill) return base;
  return `${base}?text=${encodeURIComponent(prefill)}`;
}

export function getSiteUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return siteConfig.productionUrl;
}

export function getAddressLines(): string[] {
  return [siteConfig.legalName, siteConfig.location.display];
}

export const whatsappPrefill =
  "Hello LoopC — I would like to discuss a software project.";

export const erpModules = [
  "Finance",
  "Accounting",
  "Inventory",
  "CRM",
  "HR",
  "Sales",
  "Purchasing",
  "Reports",
  "Business Management",
  "Role-based Access",
] as const;

export const erpValueProps = [
  {
    title: "One Connected Platform",
    description: "Finance, sales, inventory, customers and people — all connected from one system.",
  },
  {
    title: "Reduce Manual Work",
    description: "Replace spreadsheets and disconnected tools with automated, integrated workflows.",
  },
  {
    title: "Real-Time Business Visibility",
    description: "Live dashboards and reports give you a clear picture of your business at any time.",
  },
  {
    title: "Scale With Your Business",
    description: "Start with what you need and expand your ERP capabilities as your business grows.",
  },
] as const;

export const homeServices = [
  {
    title: "Web Applications",
    description: "Custom web platforms designed for complex business workflows and scalable operations.",
    icon: "browser",
  },
  {
    title: "Mobile Applications",
    description: "Modern mobile experiences for customers, employees and business operations.",
    icon: "phone",
  },
  {
    title: "SaaS Applications",
    description: "Cloud-based software products designed for scalability and recurring business models.",
    icon: "cloud",
  },
  {
    title: "Business Dashboards",
    description: "Interactive dashboards that turn business data into clear and useful decisions.",
    icon: "chart",
  },
  {
    title: "Custom Software",
    description: "Software designed specifically around your company's processes and requirements.",
    icon: "gears",
  },
  {
    title: "ERP & Business Systems",
    description: "Connected business systems that help organizations manage their operations more efficiently.",
    icon: "plug",
  },
  {
    title: "UI/UX Design",
    description: "Simple, intuitive and modern interfaces designed around real users.",
    icon: "pencil",
  },
  {
    title: "API & Integrations",
    description: "Connect applications, services and business workflows through reliable APIs and integrations.",
    icon: "workflow",
  },
  {
    title: "Automation",
    description: "Reduce repetitive work and improve efficiency with intelligent business automation.",
    icon: "shield",
  },
] as const;
