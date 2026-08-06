/** Site positioning copy — four offers, funnel sections, process, tech stack, work. */

export type ServiceOffer = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  buyer: string;
};

export const serviceOffers: ServiceOffer[] = [
  {
    slug: "consulting",
    title: "Business Solutions Consulting",
    summary: "We study your workflow before writing a line of code.",
    href: "/services#consulting",
    buyer: "Non-technical founders and owners",
  },
  {
    slug: "web",
    title: "Custom Web Development",
    summary: "Fast, modern websites and dashboards on a high-performance stack.",
    href: "/services#web",
    buyer: "Companies needing a digital presence",
  },
  {
    slug: "mobile",
    title: "Mobile App Development",
    summary: "Native-feel iOS and Android apps built for your customers and staff.",
    href: "/services#mobile",
    buyer: "Startups and product companies",
  },
  {
    slug: "erp",
    title: "LoopC ERP",
    summary: "Our own ready-to-use ERP — pick a plan or ask us to customize it.",
    href: "/erp",
    buyer: "SMBs who want product pricing, not a full custom build",
  },
];

export const problemCards = [
  {
    title: "Still running on spreadsheets and WhatsApp?",
    description:
      "Manual attendance, fees, inventory, and records scattered across tools — errors compound every month.",
  },
  {
    title: "No website or app your customers trust?",
    description:
      "A strong web and mobile presence is table stakes. Generic templates rarely match how you actually operate.",
  },
  {
    title: "Bought software that doesn't fit how you work?",
    description:
      "Most ERPs force your process to match the tool. We start with your workflow, then build or configure around it.",
  },
] as const;

export const processSteps = [
  {
    step: "Discover",
    description: "Map bottlenecks, stakeholders, and what success looks like before we scope build work.",
  },
  {
    step: "Design",
    description: "Wireframes, data model, and a written scope — no surprise invoices mid-project.",
  },
  {
    step: "Build",
    description: "Iterative delivery with demos you can click, not slide decks.",
  },
  {
    step: "Deploy",
    description: "Hosting, cutover, training, and go-live support so your team actually adopts it.",
  },
  {
    step: "Support",
    description: "Ongoing fixes, upgrades, and optional ERP plan upgrades as you grow.",
  },
] as const;

export const techStack = [
  { name: "Next.js", category: "Web" },
  { name: "Flutter", category: "Mobile" },
  { name: "NestJS", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
] as const;

export type CaseStudySummary = {
  slug: string;
  title: string;
  sector: string;
  problem: string;
  outcome: string;
  metrics?: string[];
  tech: string[];
};

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "coacher-max",
    title: "Coacher Max",
    sector: "EdTech · Tuition centers",
    problem:
      "Tuition centers juggled attendance, fees, schedules, and parent communication across spreadsheets and chat groups.",
    outcome:
      "A live multi-tenant SaaS platform — mobile app for parents and staff, admin dashboard, payments, and role-based access.",
    metrics: ["50+ students onboarded per center", "Multi-center live deployments", "End-to-end product ownership"],
    tech: ["Flutter", "NestJS", "PostgreSQL", "Next.js admin"],
  },
];

export const erpFeatureModules = [
  {
    title: "People & roles",
    description: "Staff, students, customers, and role-based permissions in one directory.",
  },
  {
    title: "Attendance & operations",
    description: "Daily operations tracking — attendance, check-ins, and branch-level visibility.",
  },
  {
    title: "Fees & payments",
    description: "Invoicing, collections, payment reminders, and reconciliation.",
  },
  {
    title: "Scheduling & timetable",
    description: "Classes, shifts, appointments, and resource allocation.",
  },
  {
    title: "Communication",
    description: "Announcements, chat, and notifications tied to real operational data.",
  },
  {
    title: "Reports & analytics",
    description: "Dashboards and exports leadership actually uses — not vanity charts.",
  },
] as const;

export const serviceTracks = [
  {
    id: "consulting",
    title: "Business Solutions Consulting",
    whoFor: "Owners who need clarity before committing to software spend.",
    includes: [
      "Workflow audit and bottleneck mapping",
      "Recommendations: build, buy (LoopC ERP), or manual fix",
      "Written scope — only what you need, no overselling",
    ],
    timeline: "1–2 weeks for audit and recommendation",
  },
  {
    id: "web",
    title: "Custom Web Development",
    whoFor: "Companies needing marketing sites, web apps, or admin dashboards.",
    includes: [
      "Next.js, high-performance stack",
      "Marketing sites, portals, and internal dashboards",
      "SEO-ready, mobile-responsive delivery",
    ],
    timeline: "Typical marketing site: 4–8 weeks · Web app: scoped per project",
  },
  {
    id: "mobile",
    title: "Mobile App Development (iOS / Android)",
    whoFor: "Startups and operators who need a product in customers' pockets.",
    includes: [
      "Flutter cross-platform or native where it matters",
      "App store submission support",
      "Backend API integration (NestJS, PostgreSQL)",
    ],
    timeline: "MVP: 8–14 weeks · Full product: scoped after discovery",
  },
  {
    id: "erp-product",
    title: "LoopC ERP (product + customization)",
    whoFor: "SMBs who want a proven ERP base with optional customization.",
    includes: [
      "Basic, Standard, or Premium plan — transparent tiers",
      "Module configuration to your workflow",
      "Implementation, training, and support",
    ],
    timeline: "Plan-based rollout: 2–6 weeks depending on tier",
  },
] as const;
