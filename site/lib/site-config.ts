/** Site-wide company identity. Empty contact fields stay unpublished. */

export const siteConfig = {
  brand: "LoopC",
  name: "LoopC Business Strategies",
  legalName: "LoopC Business Strategies",
  tagline: "We build software around your business.",
  description:
    "LoopC Business Strategies designs and builds mobile apps, websites, web platforms, dashboards and custom software that help businesses work smarter, serve customers better and grow.",
  supportingLine:
    "From websites and mobile apps to powerful web platforms, dashboards and custom software, LoopC turns business ideas and real-world workflows into digital products built to grow.",
  productionUrl: "https://www.loopcstrategies.com",

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
