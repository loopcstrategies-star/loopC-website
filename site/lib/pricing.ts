export type PricingTier = {
  id: string;
  name: string;
  tagline: string;
  idealFor: string;
  highlights: string[];
  priceNote: string;
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small businesses getting started",
    idealFor: "Single-location teams leaving spreadsheets",
    highlights: [
      "Core dashboard",
      "Customers & sales",
      "Expenses",
      "Basic reports",
      "User management",
    ],
    priceNote: "Contact us for pricing",
  },
  {
    id: "business",
    name: "Business",
    tagline: "For growing businesses",
    idealFor: "Teams that need accounting, inventory, and analytics",
    highlights: [
      "Everything in Starter",
      "Accounting & inventory",
      "Purchasing",
      "Advanced reports & analytics",
      "Multiple users & notifications",
    ],
    priceNote: "Request a demo for quote",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For complex operations",
    idealFor: "Multi-branch and high-volume operators",
    highlights: [
      "Everything in Business",
      "Multiple branches",
      "Custom workflows & permissions",
      "Integrations & custom modules",
      "Dedicated support",
    ],
    priceNote: "Talk to sales",
  },
  {
    id: "custom-build",
    name: "Custom Build",
    tagline: "Doesn't fit a plan? We build it.",
    idealFor: "Unique workflows — web, mobile, or deep ERP customization",
    highlights: [
      "Full discovery → design → develop → test → deploy",
      "Web, mobile, or ERP extension",
      "Your stack or ours",
      "Bridge from custom software to recurring ERP",
    ],
    priceNote: "Fixed-scope proposal after audit",
  },
];
