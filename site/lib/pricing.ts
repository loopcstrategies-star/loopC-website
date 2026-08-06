export type PricingTier = {
  id: string;
  name: string;
  tagline: string;
  idealFor: string;
  highlights: string[];
  /** Shown on page; detailed quote only after demo */
  priceNote: string;
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Core modules, one branch",
    idealFor: "Small centers, shops, or single-location teams getting off spreadsheets",
    highlights: [
      "Core ERP modules (people, operations, basic reports)",
      "Up to 5 users",
      "Single branch / location",
      "Email support",
      "Standard onboarding",
    ],
    priceNote: "From ₹X,XXX/mo — confirm on demo",
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Growing business with integrations",
    idealFor: "Growing businesses with more users, storage, and integration needs",
    highlights: [
      "Everything in Basic",
      "Up to 25 users · expanded storage",
      "Payment gateway & third-party integrations",
      "Priority support",
      "Custom reports pack",
    ],
    priceNote: "From ₹X,XXX/mo — confirm on demo",
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Multi-branch, high volume",
    idealFor: "Multi-branch operators and high-volume teams",
    highlights: [
      "Everything in Standard",
      "Unlimited users (fair use)",
      "Multi-branch / multi-tenant setup",
      "Custom modules & white-label option",
      "Dedicated success manager · SLA support",
    ],
    priceNote: "Custom quote — scoped after discovery",
  },
  {
    id: "custom-build",
    name: "Custom Build",
    tagline: "Doesn't fit a plan? We build it.",
    idealFor: "Unique workflows that need bespoke software — web, mobile, or ERP extension",
    highlights: [
      "Full discovery → design → build engagement",
      "Web, mobile, or deep ERP customization",
      "Your stack or ours (Next.js, Flutter, NestJS, PostgreSQL)",
      "Bridge from consulting to product or recurring ERP revenue",
    ],
    priceNote: "Fixed-scope proposal after audit",
  },
];
