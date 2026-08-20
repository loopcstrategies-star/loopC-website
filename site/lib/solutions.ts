export type Solution = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  points: string[];
};

export const solutions: Solution[] = [
  {
    slug: "loopc-erp",
    title: "LoopC ERP",
    summary:
      "Run finance, invoicing, inventory, CRM, HR and operations from one connected workspace — web and mobile.",
    href: "/erp",
    points: [
      "Modular subscription plans",
      "Multi-tenant with role-based access",
      "Web + mobile ready",
      "Scales from small teams to enterprise",
    ],
  },
  {
    slug: "custom-business-software",
    title: "Custom business software",
    summary:
      "When your workflow doesn't fit standard software, we design and build the system around your business.",
    href: "/services/custom-software",
    points: [
      "Designed around your operations",
      "Roles, permissions and audit trails",
      "Room to grow without a rewrite",
    ],
  },
  {
    slug: "web-applications",
    title: "Web applications",
    summary:
      "Customer portals, internal tools, and SaaS platforms — designed, built and maintained as products.",
    href: "/services/web-applications",
    points: [
      "Customer and employee experiences",
      "Secure, scalable backends",
      "Launch, then iterate",
    ],
  },
  {
    slug: "mobile-applications",
    title: "Mobile applications",
    summary:
      "Android, iOS and cross-platform apps your customers and field teams actually use.",
    href: "/services/mobile-app-development",
    points: [
      "Native and cross-platform options",
      "Offline-capable field apps",
      "Connected to your backend",
    ],
  },
  {
    slug: "automation",
    title: "Business automation",
    summary:
      "Connect the tools you already pay for. Remove retyping. Keep people on the exceptions.",
    href: "/services/business-automation",
    points: [
      "Process mapping before code",
      "APIs, webhooks and payments",
      "Clear ownership of integrations",
    ],
  },
  {
    slug: "dashboards",
    title: "Dashboards & analytics",
    summary:
      "Live views of the numbers leadership actually uses — not a dump of every column in the database.",
    href: "/services/dashboard-development",
    points: [
      "KPIs, filters and saved views",
      "Connected to your real data",
      "Built for daily use, not a demo",
    ],
  },
  {
    slug: "erp-customization",
    title: "ERP customization",
    summary:
      "Extend LoopC ERP with custom modules, workflows and integrations tailored to your organization.",
    href: "/contact?intent=expert&service=erp-customization",
    points: [
      "Custom modules and reports",
      "Workflow configuration",
      "Third-party integrations",
    ],
  },
];
