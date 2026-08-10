/** LoopC positioning — software product + custom application development company. */

export type BuildCard = {
  slug: string;
  title: string;
  summary: string;
  examples: string[];
  href: string;
  cta: string;
};

export const buildCards: BuildCard[] = [
  {
    slug: "web",
    title: "Web Applications",
    summary:
      "Powerful, scalable web applications designed for customers, employees and business operations.",
    examples: [
      "Business Portals",
      "Admin Dashboards",
      "Customer Platforms",
      "SaaS Applications",
      "Management Systems",
    ],
    href: "/services#web",
    cta: "Explore Web Development",
  },
  {
    slug: "mobile",
    title: "Mobile Applications",
    summary: "Mobile experiences that help your customers and teams work from anywhere.",
    examples: [
      "Android Apps",
      "iOS Apps",
      "Business Apps",
      "Customer Apps",
      "Field Operations",
    ],
    href: "/services#mobile",
    cta: "Explore Mobile Development",
  },
  {
    slug: "erp",
    title: "ERP Solutions",
    summary: "Connect finance, inventory, operations, sales and people in one business system.",
    examples: ["Accounting", "Inventory", "Sales", "Purchasing", "HR", "Reports", "Operations"],
    href: "/erp",
    cta: "Explore LoopC ERP",
  },
  {
    slug: "custom",
    title: "Custom Software",
    summary:
      "Have a business process that doesn't fit standard software? We build the system around it.",
    examples: [
      "Custom Workflows",
      "Integrations",
      "Automation",
      "APIs",
      "Internal Tools",
      "Business Intelligence",
    ],
    href: "/services#custom",
    cta: "Explore Custom Software",
  },
];

export const introSteps = [
  {
    num: "01",
    title: "Discover",
    description: "Understand your business, users and requirements.",
  },
  {
    num: "02",
    title: "Build",
    description: "Design and develop the right digital solution.",
  },
  {
    num: "03",
    title: "Test",
    description: "Test functionality, performance and reliability.",
  },
  {
    num: "04",
    title: "Launch",
    description: "Deploy, train and support your team.",
  },
] as const;

export const processSteps = [
  {
    step: "Discover",
    description: "We understand your business, users, requirements and goals.",
  },
  {
    step: "Design",
    description: "We turn requirements into user flows, wireframes and a clear product experience.",
  },
  {
    step: "Develop",
    description: "Our engineers build the application using scalable and modern technologies.",
  },
  {
    step: "Test",
    description: "We test functionality, usability, performance, security and real-world workflows.",
  },
  {
    step: "Deploy",
    description: "We launch your application and make it ready for your team and customers.",
  },
  {
    step: "Support",
    description: "We continue to improve, maintain and support your product after launch.",
  },
] as const;

export const qualityChecks = [
  "Functional Testing",
  "UI / UX Testing",
  "Performance Testing",
  "API Testing",
  "Cross-device Testing",
  "Bug Fixing",
] as const;

export const whyLoopc = [
  {
    title: "Business-first",
    description: "We start with your business problem, not technology.",
  },
  {
    title: "Custom-built",
    description: "Your application is designed around your workflows.",
  },
  {
    title: "End-to-end",
    description: "Design, development, testing, deployment and support under one team.",
  },
  {
    title: "Scalable",
    description: "Build today with the ability to grow tomorrow.",
  },
  {
    title: "Connected",
    description: "Bring your teams, data and operations into one system.",
  },
  {
    title: "Long-term partner",
    description: "We stay with you beyond the initial launch.",
  },
] as const;

export const industryFocus = [
  "Jewelry & Precious Metals",
  "Manufacturing",
  "Trading & Distribution",
  "Retail",
  "Education",
  "Finance",
  "Professional Services",
  "Startups & SaaS",
] as const;

export const techGroups = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript"] },
  { label: "Mobile", items: ["Flutter", "React Native"] },
  { label: "Backend", items: ["Node.js", "NestJS"] },
  { label: "Database", items: ["PostgreSQL", "MongoDB"] },
  { label: "Cloud", items: ["AWS", "Vercel"] },
] as const;

/** @deprecated use techGroups — kept for About page chip strip */
export const techStack = [
  { name: "Next.js", category: "Web" },
  { name: "Flutter", category: "Mobile" },
  { name: "NestJS", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
] as const;

export type CaseStudySummary = {
  slug: string;
  title: string;
  sector: string;
  problem: string;
  outcome: string;
  metrics?: string[];
  tech: string[];
  image?: string;
};

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "coacher-max",
    title: "Coacher Max",
    sector: "Education",
    problem:
      "Tuition centers juggled attendance, fees, schedules, and parent communication across spreadsheets and chat groups.",
    outcome:
      "A live multi-tenant SaaS platform — mobile app for parents and staff, admin dashboard, payments, and role-based access.",
    metrics: ["Multi-tenant live", "Mobile + admin", "End-to-end ownership"],
    tech: ["Flutter", "NestJS", "PostgreSQL", "Next.js"],
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&q=85",
  },
];

export const erpModules = [
  "Accounting",
  "Inventory",
  "Sales",
  "Purchasing",
  "Customers",
  "Vendors",
  "HR",
  "Attendance",
  "Operations",
  "Reports",
  "Dashboard",
  "Notifications",
] as const;

export const erpFeatureModules = [
  { title: "Accounting", description: "Ledgers, expenses, and financial visibility in one place." },
  { title: "Inventory", description: "Stock, warehouses, and movement tracking across locations." },
  { title: "Sales & purchasing", description: "Orders, invoices, vendors, and procurement flows." },
  { title: "Customers & vendors", description: "CRM-style records tied to real operational data." },
  { title: "HR & attendance", description: "People, roles, and daily operations visibility." },
  { title: "Reports & dashboard", description: "Management views leadership actually uses." },
] as const;

export const customWorkflow = [
  "Customer Management",
  "Sales",
  "Operations",
  "Inventory",
  "Accounting",
  "Reports",
] as const;

export const serviceTracks = [
  {
    id: "web",
    title: "Web Application Development",
    whoFor: "Companies needing portals, dashboards, SaaS products, or customer platforms.",
    includes: [
      "Business portals and admin dashboards",
      "Customer platforms and SaaS applications",
      "Scalable Next.js / React frontends",
      "SEO-ready, mobile-responsive delivery",
    ],
    timeline: "Marketing site: 4–8 weeks · Web app: scoped per project",
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    whoFor: "Teams that need Android, iOS, or cross-platform apps for customers or staff.",
    includes: [
      "Android and iOS (Flutter / React Native)",
      "Business and customer-facing apps",
      "Field operations and offline-friendly flows",
      "App store submission support",
    ],
    timeline: "MVP: 8–14 weeks · Full product: scoped after discovery",
  },
  {
    id: "erp",
    title: "ERP Solutions",
    whoFor: "Businesses that want LoopC ERP or a customized ERP around their operations.",
    includes: [
      "LoopC ERP plans (Starter / Business / Enterprise)",
      "Module configuration to your workflow",
      "Accounting, inventory, sales, HR, and reports",
      "Implementation, training, and support",
    ],
    timeline: "Plan-based rollout: 2–6 weeks depending on tier",
  },
  {
    id: "custom",
    title: "Custom Software",
    whoFor: "Operators whose process doesn't fit off-the-shelf tools.",
    includes: [
      "Custom workflows and internal tools",
      "Integrations, APIs, and automation",
      "Business intelligence and reporting",
      "Discovery → design → build → test → deploy",
    ],
    timeline: "Scoped after discovery — fixed proposal before build",
  },
  {
    id: "design",
    title: "UI / UX Design",
    whoFor: "Teams that need clear product experience before engineering.",
    includes: [
      "User flows and wireframes",
      "Interface design for web and mobile",
      "Design systems that scale with the product",
      "Handoff ready for development",
    ],
    timeline: "Typical design phase: 2–4 weeks",
  },
  {
    id: "testing",
    title: "Testing & QA",
    whoFor: "Anyone shipping software that must work in the real world.",
    includes: [
      "Functional, UI/UX, and performance testing",
      "API and cross-device testing",
      "Bug fixing before go-live",
      "Regression checks on releases",
    ],
    timeline: "Bundled with delivery or standalone QA sprints",
  },
  {
    id: "support",
    title: "Maintenance & Support",
    whoFor: "Clients who want a long-term technology partner after launch.",
    includes: [
      "Monitoring, fixes, and upgrades",
      "Feature enhancements as you grow",
      "Hosting and deployment support",
      "Priority response plans available",
    ],
    timeline: "Monthly retainers or project-based support",
  },
] as const;

/** Alias for older imports */
export const serviceOffers = buildCards.map((c) => ({
  slug: c.slug,
  title: c.title,
  summary: c.summary,
  href: c.href,
  buyer: c.examples.slice(0, 2).join(" · "),
}));
