export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  navLabel: string;
  summary: string;
  description: string;
  whoFor: string;
  includes: string[];
  outcomes: string[];
  related: string[];
  href: string;
  motif: "phone" | "browser" | "app" | "chart" | "workflow" | "pencil" | "gears" | "plug" | "shield";
};

export const services: Service[] = [
  {
    slug: "mobile-app-development",
    title: "Mobile Apps",
    shortTitle: "Mobile Apps",
    navLabel: "Mobile Apps",
    summary: "Native-quality mobile experiences for customers, employees and field teams.",
    description:
      "We design and build Android and iOS applications that fit how people actually work — not generic templates. From customer apps to staff tools and field operations, LoopC delivers mobile products that are clear, reliable and ready to grow.",
    whoFor:
      "Businesses that need a customer app, an employee app, or a field tool that has to work outside the office.",
    includes: [
      "iOS and Android apps with Flutter or React Native",
      "Native-quality UI, offline-friendly flows where needed",
      "Authentication, notifications and payments",
      "App store submission support",
      "Ongoing iteration after launch",
    ],
    outcomes: [
      "A mobile product your team and customers can actually use",
      "One codebase strategy when it fits — native where it matters",
      "A clear path from MVP to a maintained product",
    ],
    related: ["ui-ux", "web-applications", "api-integrations"],
    href: "/services/mobile-app-development",
    motif: "phone",
  },
  {
    slug: "web-development",
    title: "Websites",
    shortTitle: "Websites",
    navLabel: "Websites",
    summary: "High-performance websites designed for credibility, discovery and conversion.",
    description:
      "Your website is often the first serious look a buyer takes at your company. We build fast, SEO-ready sites that explain what you do, who you serve and how to start — with the performance and structure search engines and customers both expect.",
    whoFor:
      "Companies that need a credible marketing site, a product site, or a rebuild of a slow or outdated website.",
    includes: [
      "Information architecture and conversion-focused UX",
      "Responsive design across desktop, tablet and mobile",
      "SEO-ready Next.js architecture",
      "CMS integration where editors need control",
      "Analytics and form-driven lead capture",
    ],
    outcomes: [
      "A site that loads quickly and reads clearly",
      "Pages structured for search without keyword stuffing",
      "A path from visit to enquiry that feels natural",
    ],
    related: ["ui-ux", "web-applications", "support-growth"],
    href: "/services/web-development",
    motif: "browser",
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    shortTitle: "Web Applications",
    navLabel: "Web Applications",
    summary: "Custom portals, SaaS platforms, customer systems and operational applications.",
    description:
      "When a brochure site is not enough, we build web applications — portals, SaaS products, customer systems and internal tools — around your workflows, roles and data. These are products people log into every day.",
    whoFor:
      "Teams that need a portal, a multi-tenant product, or an operational system in the browser.",
    includes: [
      "Role-based portals and admin dashboards",
      "SaaS and multi-tenant product architecture",
      "Customer and employee applications",
      "Secure authentication and permissions",
      "API-backed, scalable frontends in React and Next.js",
    ],
    outcomes: [
      "Software that matches how your business actually operates",
      "A product you can keep extending instead of replacing",
      "Clear ownership of code, hosting and next releases",
    ],
    related: ["custom-software", "dashboard-development", "api-integrations"],
    href: "/services/web-applications",
    motif: "app",
  },
  {
    slug: "dashboard-development",
    title: "Business Dashboards",
    shortTitle: "Dashboards",
    navLabel: "Dashboards",
    summary: "Real-time dashboards that turn business data into actionable information.",
    description:
      "Leaders should not wait for a spreadsheet to know what is happening. We build dashboards that surface the numbers that matter — revenue, orders, operations, customers — with filters, reports and views designed for how your team decides.",
    whoFor:
      "Operators and founders who need live visibility across sales, operations, inventory or customers.",
    includes: [
      "KPI boards, charts and operational views",
      "Role-based reports and saved filters",
      "Connections to existing databases and APIs",
      "Exportable reports for leadership and finance",
      "Mobile-friendly monitoring where needed",
    ],
    outcomes: [
      "One place to see what is happening in the business",
      "Fewer manual report cycles",
      "Decisions based on current data, not last week's export",
    ],
    related: ["custom-software", "web-applications", "business-automation"],
    href: "/services/dashboard-development",
    motif: "chart",
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    shortTitle: "Custom Software",
    navLabel: "Custom Software",
    summary:
      "Software designed around unique business workflows instead of forcing businesses into generic tools.",
    description:
      "Standard products assume your process looks like everyone else's. When it doesn't, we design and build the system that fits — internal management, customer portals, inventory, approvals, booking, CRM-style workflows, reporting and industry-specific tools.",
    whoFor:
      "Businesses whose workflows, approvals or data model do not fit off-the-shelf software.",
    includes: [
      "Internal management and workflow systems",
      "Customer and employee applications",
      "Inventory, booking, approval and CRM-style platforms",
      "Reporting and business intelligence views",
      "Discovery, design, build, test, launch and support",
    ],
    outcomes: [
      "Software that follows your process, not the other way around",
      "Less spreadsheet and chat-group operations",
      "A system you can keep improving as the business changes",
    ],
    related: ["business-automation", "dashboard-development", "api-integrations"],
    href: "/services/custom-software",
    motif: "workflow",
  },
  {
    slug: "ui-ux",
    title: "UI/UX Design",
    shortTitle: "UI/UX",
    navLabel: "UI/UX",
    summary: "Research, wireframes, design systems and intuitive product experiences.",
    description:
      "Software fails when people cannot find the next step. We research the work, map the flows, and design interfaces that feel obvious — then hand a coherent system to engineering so the product stays consistent as it grows.",
    whoFor:
      "Teams that need product design before, or alongside, engineering — websites, apps and dashboards.",
    includes: [
      "User research and workflow mapping",
      "Wireframes and interactive prototypes",
      "Visual design for web and mobile",
      "Design systems and component libraries",
      "Handoff ready for development",
    ],
    outcomes: [
      "Fewer surprises in development",
      "Interfaces people can use without a training manual",
      "A design language that scales with new features",
    ],
    related: ["web-development", "mobile-app-development", "web-applications"],
    href: "/services/ui-ux",
    motif: "pencil",
  },
  {
    slug: "business-automation",
    title: "Business Automation",
    shortTitle: "Automation",
    navLabel: "Automation",
    summary: "Automate repetitive processes and connect systems to reduce manual work.",
    description:
      "If a process is copied between spreadsheets, email and chat every day, it is a candidate for software. We map the work, remove the duplicate steps, and connect the systems so people spend time on exceptions — not on retyping.",
    whoFor:
      "Operations teams drowning in repetitive data entry, hand-offs and status chasing.",
    includes: [
      "Process mapping and automation design",
      "Approvals, notifications and scheduled jobs",
      "Connections between existing tools",
      "Exception handling so people stay in control",
      "Measurement so you can see what actually improved",
    ],
    outcomes: [
      "Fewer manual hand-offs",
      "Faster cycle times on routine work",
      "A clearer audit trail of what happened and when",
    ],
    related: ["custom-software", "api-integrations", "dashboard-development"],
    href: "/services/business-automation",
    motif: "gears",
  },
  {
    slug: "api-integrations",
    title: "API & Integrations",
    shortTitle: "APIs",
    navLabel: "API & Integrations",
    summary: "Connect existing systems, payment platforms, third-party services and internal tools.",
    description:
      "Most businesses already have software. The problem is that it does not talk. We build APIs and integrations so payments, inventory, CRM, accounting and internal tools share data instead of forcing people to copy it.",
    whoFor:
      "Companies stitching together existing platforms, payment gateways, or internal services.",
    includes: [
      "REST APIs and webhook-based integrations",
      "Payment, messaging and third-party services",
      "Data sync between internal and external systems",
      "Authentication and access control",
      "Documentation and handover for your team",
    ],
    outcomes: [
      "One source of truth instead of three copies",
      "Reliable connections instead of brittle exports",
      "Room to add the next system without starting over",
    ],
    related: ["custom-software", "web-applications", "business-automation"],
    href: "/services/api-integrations",
    motif: "plug",
  },
  {
    slug: "support-growth",
    title: "Support & Growth",
    shortTitle: "Support",
    navLabel: "Support & Growth",
    summary: "Continuous improvements, maintenance, monitoring and future development.",
    description:
      "Launch is the start of the product, not the end. We stay on as a technology partner — monitoring, fixing, improving and building the next set of features as the business changes.",
    whoFor:
      "Teams that want a long-term engineering partner after the first release.",
    includes: [
      "Maintenance, monitoring and incident response",
      "Performance and security improvements",
      "Feature development on a planned cadence",
      "Hosting and deployment support",
      "Priority response plans where needed",
    ],
    outcomes: [
      "Software that stays current instead of going stale",
      "A partner who already knows the product",
      "Room to grow without a new vendor search each year",
    ],
    related: ["custom-software", "web-applications", "mobile-app-development"],
    href: "/services/support-growth",
    motif: "shield",
  },
];

export const footerServiceLinks = [
  { href: "/services/mobile-app-development", label: "Mobile Apps" },
  { href: "/services/web-development", label: "Websites" },
  { href: "/services/web-applications", label: "Web Applications" },
  { href: "/services/dashboard-development", label: "Dashboards" },
  { href: "/services/custom-software", label: "Custom Software" },
  { href: "/services/ui-ux", label: "UI/UX" },
] as const;

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(slug: string): Service[] {
  const current = getService(slug);
  if (!current) return [];
  return current.related
    .map((relatedSlug) => getService(relatedSlug))
    .filter((service): service is Service => Boolean(service));
}
