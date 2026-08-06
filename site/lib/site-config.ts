/** Site-wide copy and URLs. Swap placeholders when you have final details. */

export const siteConfig = {
  /** Short brand for UI where space is tight */
  brand: "LoopC",
  /** Legal / full company name */
  name: "LoopC Business Strategies",
  legalName: "LoopC Business Strategies",
  tagline:
    "We turn business bottlenecks into software — websites, apps, and ERP systems built around how you actually work.",
  description:
    "LoopC diagnoses business problems, then builds the fix: custom web and mobile apps, business consulting, and LoopC ERP — our own SaaS product with transparent plans.",
  /** One line for hero / CTAs */
  erpSalesLine:
    "Web platforms, mobile apps, and our own ERP — designed around how your business actually works, not a generic template.",
  /** Short value props for badges, pills, and CTAs */
  customizationLine:
    "We customize the application to your workflows, reports, approvals, and integrations—not a one-size-fits-all template.",
  pricingLine:
    "Low, transparent pricing scoped to your modules and team size—no enterprise-only price tags.",
  /** ERP dashboard interface languages */
  dashboardLanguages: [
    { code: "EN", name: "English" },
    { code: "SA", name: "Arabic (Saudi Arabia)" },
    { code: "UZ", name: "Uzbek" },
    { code: "RU", name: "Russian" },
  ] as const,
  dashboardLanguageLine:
    "Our ERP dashboard is available in English, Arabic (SA), Uzbek, and Russian—switch language in one click.",
  /** Product brochure PDF in /public — update when you have the final file */
  brochurePath: "/loopc-erp-brochure.pdf",
  /** Used for metadataBase and Open Graph when NEXT_PUBLIC_SITE_URL is unset */
  productionUrl: "https://www.loopc.com",
  contactEmail: "hello@loopc.com",
  salesEmail: "sales@loopc.com",
  /** E.164 without + for wa.me links */
  whatsappE164: "919876543210",
  phoneDisplay: "+91 44 4000 0000",
  phoneTel: "+914440000000",
  /** Replace with your GSTIN when registered */
  gstNumber: "GSTIN: 33AAAAA0000A1Z5 (placeholder — update in site-config)",
  addressLines: [
    "LoopC Business Strategies",
    "Anna Salai, Nungambakkam",
    "Chennai — 600034",
    "Tamil Nadu, India",
  ] as const,
  businessHours: "Mon–Fri: 9:30 AM – 6:30 PM IST · Sat: By appointment · Sun: Closed",
  /** Update these URLs to your real profiles */
  social: {
    linkedIn: "https://www.linkedin.com/company/loopc-business-strategies",
    x: "https://x.com/loopc",
    youTube: "https://www.youtube.com/@LoopCBusinessStrategies",
  },
};

export function getWhatsAppUrl(): string {
  return `https://wa.me/${siteConfig.whatsappE164}`;
}

export function getSiteUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return siteConfig.productionUrl;
}

export function getDashboardLanguageCodes(): string {
  return siteConfig.dashboardLanguages.map((lang) => lang.code).join(" · ");
}
