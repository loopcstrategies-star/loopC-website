export type Solution = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  points: string[];
};

export const solutions: Solution[] = [
  {
    slug: "custom-systems",
    title: "Custom business systems",
    summary:
      "When a standard product fights your process, we build the system that fits — workflows, records, approvals and reports.",
    href: "/services/custom-software",
    points: [
      "Designed around your operations",
      "Roles, permissions and audit trails",
      "Room to grow without a rewrite",
    ],
  },
  {
    slug: "dashboards",
    title: "Decision dashboards",
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
    slug: "digital-products",
    title: "Digital products",
    summary:
      "Websites, web applications and mobile apps that customers and staff can live in — designed, built and maintained as products.",
    href: "/services/web-applications",
    points: [
      "Customer and employee experiences",
      "Web and mobile, one product thinking",
      "Launch, then iterate",
    ],
  },
  {
    slug: "automation",
    title: "Automation and integrations",
    summary:
      "Connect the tools you already pay for. Remove the retyping. Keep people on the exceptions.",
    href: "/services/business-automation",
    points: [
      "Process mapping before code",
      "APIs, webhooks and payments",
      "Clear ownership of what talks to what",
    ],
  },
];
