/** Site-wide company identity. Empty contact fields stay unpublished. */

export const siteConfig = {
  brand: "LoopC",
  name: "LoopC Business Strategies",
  legalName: "LoopC Business Strategies",
  tagline: "Software built around the way your business works.",
  description:
    "LoopC builds and delivers ERP, web applications, mobile apps, dashboards and custom business software for growing companies.",
  supportingLine:
    "LoopC builds and delivers ERP, web applications, mobile apps, dashboards and custom business software for growing companies.",
  footerTagline:
    "Business software built around the way your business works.",
  productionUrl: "https://www.loopcstrategies.com",

  positioning: {
    eyebrow: "BUSINESS SOFTWARE • ERP • WEB • MOBILE",
    heroSupport:
      "From strategy and design to development, launch and long-term support.",
    erpHeadline: "One workspace for your entire business.",
    erpCopy:
      "Bring finance, sales, inventory, customers and people into one connected system. Start with the modules you need and expand as your business grows.",
    customSoftwareHeadline: "Your business is different. Your software can be too.",
    customSoftwareCopy:
      "Not every business can operate inside a standard workflow. We design and build custom software around your processes, data and customers.",
    dualOfferingHeadline: "One company. Two ways to work with us.",
    finalCtaHeadline: "Ready to build software that works the way your business does?",
    finalCtaCopy:
      "Start with LoopC ERP or tell us what you need to build. We'll help you find the right path.",
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
  "Accounting",
  "Invoicing",
  "Inventory",
  "Sales",
  "Purchasing",
  "CRM",
  "HR",
  "Payroll",
  "Reports",
  "Analytics",
] as const;

export const erpValueProps = [
  {
    title: "Modular",
    description: "Pay for the capabilities your business needs and expand as you grow.",
  },
  {
    title: "Connected",
    description: "Finance, sales, inventory, customers and operations work from shared data.",
  },
  {
    title: "Flexible",
    description: "Configure roles, workflows and business rules around your organization.",
  },
  {
    title: "Scalable",
    description: "Start with a small team and grow into a complete business platform.",
  },
] as const;
