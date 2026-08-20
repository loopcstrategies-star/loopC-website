export type ProcessStep = {
  id: string;
  num: string;
  title: string;
  summary: string;
  detail: string;
};

export const deliveryProcess: ProcessStep[] = [
  {
    id: "strategy",
    num: "01",
    title: "Strategy",
    summary: "Understand the business, the users and the constraint.",
    detail:
      "We start with how the work happens today — who does what, where it breaks, and what “better” would change. The output is a shared picture of the product, not a slide deck of buzzwords.",
  },
  {
    id: "ux",
    num: "02",
    title: "UX",
    summary: "Map flows before screens.",
    detail:
      "We design the path a person takes: the first action, the exception, the approval, the report. If the flow is wrong, visual design will not save it.",
  },
  {
    id: "ui",
    num: "03",
    title: "UI",
    summary: "Make the product clear and consistent.",
    detail:
      "Interfaces, components and states — empty, loading, error, success — so engineering builds one system instead of a pile of screens.",
  },
  {
    id: "development",
    num: "04",
    title: "Development",
    summary: "Build the real product, not a demo that cannot grow.",
    detail:
      "Web, mobile and backend work against the same model. We keep the architecture boring where it should be boring, and custom where the business is custom.",
  },
  {
    id: "testing",
    num: "05",
    title: "Testing",
    summary: "Prove it works the way the business works.",
    detail:
      "Functional checks, the awkward cases, devices and roles. We would rather find the broken path in staging than in your first live week.",
  },
  {
    id: "deployment",
    num: "06",
    title: "Deployment",
    summary: "Launch with a plan, not a hope.",
    detail:
      "Hosting, access, data, and a go-live sequence your team can actually follow. Launch is a delivery step, not a surprise.",
  },
  {
    id: "support",
    num: "07",
    title: "Support",
    summary: "Stay on as the product meets real use.",
    detail:
      "Monitoring, fixes, and the next set of features. Software that is used will change. We plan for that instead of disappearing after the invoice.",
  },
];

export const productStorySteps = [
  "Idea",
  "Business requirements",
  "Product strategy",
  "UX/UI",
  "Development",
  "Testing",
  "Launch",
  "Optimization",
] as const;

export const customSoftwareCapabilities = [
  "Internal management systems",
  "Customer portals",
  "Employee applications",
  "Inventory platforms",
  "Workflow systems",
  "Booking systems",
  "CRM-style systems",
  "Reporting platforms",
  "Approval systems",
  "Automation tools",
  "Business intelligence dashboards",
  "Industry-specific software",
] as const;

export const customSoftwareJourney: ProcessStep[] = [
  {
    id: "requirements",
    num: "01",
    title: "Requirements",
    summary: "Understand the workflow, users and constraints.",
    detail:
      "We map how work happens today — approvals, exceptions, data sources — before proposing screens or architecture.",
  },
  {
    id: "design",
    num: "02",
    title: "Design",
    summary: "Flows, UX and UI aligned to the business.",
    detail:
      "Wireframes and interfaces that match how people actually work, not generic admin templates.",
  },
  {
    id: "development",
    num: "03",
    title: "Development",
    summary: "Build the product with room to grow.",
    detail:
      "Web, mobile and backend against a shared model — modular where the business will change.",
  },
  {
    id: "testing",
    num: "04",
    title: "Testing",
    summary: "Prove it works in real scenarios.",
    detail:
      "Roles, devices and edge cases — especially the awkward Tuesday-morning path.",
  },
  {
    id: "launch",
    num: "05",
    title: "Launch",
    summary: "Go live with a clear handover.",
    detail:
      "Deployment, access, training and a go-live sequence your team can follow.",
  },
  {
    id: "support",
    num: "06",
    title: "Support",
    summary: "Stay on as the product evolves.",
    detail:
      "Fixes, improvements and the next features as the business changes.",
  },
];
