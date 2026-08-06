export type LeadOffer = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  cta: string;
  intent: "audit" | "demo" | "consultation" | "brochure";
  bullets: string[];
};

export const leadOffers: LeadOffer[] = [
  {
    slug: "free-audit",
    title: "Free Audit",
    headline: "Get a Free Business Process Audit",
    description:
      "We review how you manage inventory, purchases, sales, and accounts today—and map gaps where ERP can recover margin.",
    cta: "Request free audit",
    intent: "audit",
    bullets: [
      "30-minute structured review with our consultant",
      "Process map: order → stock → invoice → books",
      "Written summary of top 3 improvement areas",
    ],
  },
  {
    slug: "free-demo",
    title: "Free Demo",
    headline: "Book a free demo or scoping call",
    description:
      "Two paths: try LoopC ERP on your workflow, or get a custom build quote for web or mobile. Tell us which you need — we'll prep the right demo.",
    cta: "Book free demo",
    intent: "demo",
    bullets: [
      "LoopC ERP — live product walkthrough and plan recommendation",
      "Custom build — scope, timeline, and stack (Next.js, Flutter, NestJS)",
      "No obligation — honest answer if consulting beats code",
    ],
  },
  {
    slug: "free-consultation",
    title: "Free Consultation",
    headline: "Find Inventory Leakage and Profit Loss Areas",
    description:
      "A focused session on where trading businesses lose money: dead stock, credit leakage, pricing drift, and delayed collections.",
    cta: "Book free consultation",
    intent: "consultation",
    bullets: [
      "Leakage checklist for wholesale & distribution",
      "Benchmarks from similar trading businesses",
      "Actionable recommendations—no obligation",
    ],
  },
];

export function getLeadOffer(slug: string): LeadOffer | undefined {
  return leadOffers.find((o) => o.slug === slug);
}
