export type Industry = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  challenges: string[];
  capabilities: string[];
  workflows: string[];
  relevantServices: string[];
  faqs: { q: string; a: string }[];
  /** Alias-friendly field for detail template */
  problems?: string[];
  erpModules?: string[];
  customSoftwareOpportunities?: string[];
};

export const industries: Industry[] = [
  {
    slug: "trading",
    title: "Trading",
    shortTitle: "Trading",
    summary: "Software for trading businesses that need live numbers, not end-of-day spreadsheets.",
    problem:
      "Trades, inventory, customers and margins often live in separate files. By the time a report is ready, the position has already changed.",
    solution:
      "We build operational systems and dashboards that connect orders, stock, customers and reporting — so trading teams can see what they hold, what they owe and what they earned.",
    outcome:
      "A working system around the way the desk actually trades, instead of a generic package that fights the workflow.",
    challenges: [
      "Positions and stock scattered across spreadsheets",
      "Customer-wise margin that is hard to see in time",
      "Purchasing, sales and inventory that do not agree",
      "Manual follow-up on outstanding and deliveries",
    ],
    capabilities: [
      "Order and inventory tracking",
      "Customer and vendor records tied to real transactions",
      "Margin and position views for leadership",
      "Approvals for rate, credit and dispatch",
    ],
    workflows: [
      "Enquiry → quote → order → dispatch",
      "Purchase → inward → stock → sale",
      "Outstanding follow-up and collection views",
    ],
    relevantServices: [
      "custom-software",
      "dashboard-development",
      "web-applications",
      "business-automation",
    ],
    faqs: [
      {
        q: "Do you sell a ready-made trading ERP?",
        a: "We build software around how your trading business works. That can include inventory, orders, customers and dashboards — as a custom system, not a one-size product you have to squeeze into.",
      },
      {
        q: "Can this connect to what we already use?",
        a: "Yes. Integrations with existing accounting, payment or operational tools are part of the work when they are needed.",
      },
    ],
  },
  {
    slug: "wholesale",
    title: "Wholesale",
    shortTitle: "Wholesale",
    summary: "Systems for wholesalers who move volume and need stock, orders and credit under control.",
    problem:
      "Wholesale work is volume plus relationships. When stock, schemes, credit and deliveries are tracked by memory and Excel, errors show up as lost margin.",
    solution:
      "We design wholesale operations software — catalogues, bulk orders, stock across locations, credit limits and dispatch — around the way your team already sells.",
    outcome:
      "Orders move with fewer phone calls, and stock and credit stay visible to the people who need them.",
    challenges: [
      "Multi-location stock that does not match the floor",
      "Credit and scheme rules applied inconsistently",
      "Slow order-to-dispatch cycles",
      "Little visibility for owners during the day",
    ],
    capabilities: [
      "Bulk order capture and fulfilment",
      "Warehouse and batch visibility",
      "Customer credit and outstanding views",
      "Sales and stock dashboards",
    ],
    workflows: [
      "Order booking → allocation → dispatch → invoice",
      "Purchase planning against movement",
      "Credit check before release",
    ],
    relevantServices: [
      "custom-software",
      "web-applications",
      "dashboard-development",
      "mobile-app-development",
    ],
    faqs: [
      {
        q: "Can field sales use this on a phone?",
        a: "Yes. We often pair a web operations system with a mobile app for booking, stock checks and collections.",
      },
      {
        q: "Will this replace our accountant's software?",
        a: "Not necessarily. Many wholesalers keep their accounting tool and let LoopC software handle operations, then integrate the two.",
      },
    ],
  },
  {
    slug: "distribution",
    title: "Distribution",
    shortTitle: "Distribution",
    summary: "Software for distributors who need routes, stock and partners to stay in sync.",
    problem:
      "Distribution breaks when the warehouse, the van and the partner network each have a different version of the truth.",
    solution:
      "We build distribution systems that connect inventory, secondary sales, returns and partner accounts — with dashboards for the people running the network.",
    outcome:
      "Fewer stock-outs from bad information, and a clearer picture of what each route and partner is doing.",
    challenges: [
      "Primary vs secondary sales that do not reconcile",
      "Returns and damaged stock handled off-system",
      "Partner claims that take weeks to settle",
      "No live view of van or warehouse stock",
    ],
    capabilities: [
      "Stock movement across warehouses and routes",
      "Partner and retailer account views",
      "Returns and claim tracking",
      "Operational dashboards for distribution managers",
    ],
    workflows: [
      "Indent → load → delivery → acknowledgement",
      "Return → inspection → credit",
      "Partner statement and claim cycle",
    ],
    relevantServices: [
      "custom-software",
      "mobile-app-development",
      "dashboard-development",
      "api-integrations",
    ],
    faqs: [
      {
        q: "Do you only work with large distribution networks?",
        a: "No. We scope the system to the network you actually run — a few routes or many — and grow it as the business grows.",
      },
      {
        q: "Can drivers or delivery staff use it?",
        a: "When the workflow needs it, we build simple mobile flows for load, delivery and collection instead of forcing warehouse software onto a phone.",
      },
    ],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    shortTitle: "Manufacturing",
    summary: "Custom systems for manufacturers who need production, materials and orders to line up.",
    problem:
      "Production plans live in one file, materials in another, and customer dates in a third. The floor finds out late.",
    solution:
      "We build manufacturing operations software around your process — job cards, materials, quality checks, dispatch — without forcing a generic MRP you will not use.",
    outcome:
      "A clearer line from order to dispatch, with the shop floor and the office looking at the same work.",
    challenges: [
      "Job status that only the supervisor knows",
      "Material shortages discovered mid-run",
      "Quality checks recorded on paper",
      "Dispatch dates promised without capacity visibility",
    ],
    capabilities: [
      "Order-to-job tracking",
      "Material and stores views",
      "Simple shop-floor status capture",
      "Production and dispatch dashboards",
    ],
    workflows: [
      "Order → planning → job → quality → dispatch",
      "Material issue and return",
      "Rework and hold handling",
    ],
    relevantServices: [
      "custom-software",
      "dashboard-development",
      "business-automation",
      "web-applications",
    ],
    faqs: [
      {
        q: "Is this a full manufacturing ERP?",
        a: "We build the parts you will actually run. For some plants that is planning plus stores plus dispatch. For others it is a narrower workflow. We do not sell a unused 40-module suite.",
      },
      {
        q: "Can this work alongside machines or existing tools?",
        a: "Where there is a usable API or export, we integrate. Where the floor is still paper, we start with a practical capture step.",
      },
    ],
  },
  {
    slug: "retail",
    title: "Retail",
    shortTitle: "Retail",
    summary: "Software for retailers who need stock, billing and customer experience to stay consistent.",
    problem:
      "Counter, warehouse and online each tell a different stock story. Promotions and customer history live in people's heads.",
    solution:
      "We build retail systems — billing support, stock, customer records, and when needed a customer-facing app or site — that keep store operations honest.",
    outcome:
      "Staff sell against real stock, and owners see movement without waiting for a month-end file.",
    challenges: [
      "Stock mismatch between counter and store room",
      "Customer history that resets every visit",
      "Offers applied inconsistently",
      "No clean view across branches",
    ],
    capabilities: [
      "Branch stock and transfer views",
      "Customer records and order history",
      "Promotions and billing support",
      "Owner dashboards across locations",
    ],
    workflows: [
      "Receive → putaway → sale → replenish",
      "Transfer between branches",
      "Return and exchange",
    ],
    relevantServices: [
      "custom-software",
      "web-development",
      "mobile-app-development",
      "dashboard-development",
    ],
    faqs: [
      {
        q: "Do you replace our billing machine?",
        a: "Not always. Sometimes we sit beside an existing billing tool and take care of stock, customers and reporting. Sometimes we build the full flow. We decide that in discovery.",
      },
      {
        q: "Can customers get an app?",
        a: "Yes, when it is useful — catalogues, orders, loyalty or service booking — rather than an app for the sake of an app.",
      },
    ],
  },
  {
    slug: "education",
    title: "Education",
    shortTitle: "Education",
    summary: "Products for education businesses that run centres, batches, fees and parent communication.",
    problem:
      "Tuition centres and training businesses often run attendance, fees and parent updates across notebooks, spreadsheets and chat groups.",
    solution:
      "We build education products — admin dashboards, parent and staff mobile apps, fees, batches and communication — the same way we built Coacher Max for tuition centres.",
    outcome:
      "Centres run on one system. Parents get a proper channel. Owners see batches and collections without calling every teacher.",
    challenges: [
      "Attendance that cannot be audited later",
      "Fee follow-up that lives in personal chats",
      "Batch and timetable changes that do not reach parents",
      "No branch-level view for owners",
    ],
    capabilities: [
      "Multi-tenant centre administration",
      "Parent and staff mobile apps",
      "Fees, attendance and scheduling",
      "Announcements and role-based access",
    ],
    workflows: [
      "Enquiry → admission → batch → attendance",
      "Fee schedule → reminder → collection",
      "Announcement → parent acknowledgement",
    ],
    relevantServices: [
      "web-applications",
      "mobile-app-development",
      "custom-software",
      "ui-ux",
    ],
    faqs: [
      {
        q: "Is Coacher Max available for our centre?",
        a: "Coacher Max is a LoopC product for tuition centres. If it fits, we can talk about it. If your model is different, we design a system around your centre instead of forcing a product.",
      },
      {
        q: "Do you only work with tuition centres?",
        a: "Tuition centres are a proven workflow for us. Training institutes and similar education operations with batches, fees and parents are in the same family of problems.",
      },
    ],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    shortTitle: "Professional Services",
    summary: "Software for firms that sell expertise and need clients, work and billing in one place.",
    problem:
      "Client work, time, documents and invoices often sit in email. Nobody can answer “where does this stand?” without a meeting.",
    solution:
      "We build client portals, matter or project tracking, approvals and reporting for firms that sell services — so delivery and billing share the same picture.",
    outcome:
      "Clients get a calmer channel. The firm sees pipeline, work-in-progress and what is ready to bill.",
    challenges: [
      "Status trapped in inboxes",
      "Documents scattered across personal drives",
      "Billing that lags delivery",
      "No shared view for partners",
    ],
    capabilities: [
      "Client portals and document exchange",
      "Work tracking and approvals",
      "Internal dashboards for partners",
      "Integrations with existing accounting where useful",
    ],
    workflows: [
      "Lead → engagement → delivery → invoice",
      "Document request → client upload → review",
      "Internal approval before send",
    ],
    relevantServices: [
      "web-applications",
      "custom-software",
      "ui-ux",
      "dashboard-development",
    ],
    faqs: [
      {
        q: "Will this replace our practice management tool?",
        a: "Only if that is the right call. Many firms need a client portal and a cleaner internal view, not a full replacement of every tool they already pay for.",
      },
      {
        q: "Can clients log in?",
        a: "Yes. Client-facing portals with the right permissions are a common part of this work.",
      },
    ],
  },
];

const defaultErpModules = ["Accounting", "Invoicing", "Inventory", "Sales", "CRM", "Reports"];

export function getIndustryProblems(industry: Industry): string[] {
  return industry.problems ?? industry.challenges;
}

export function getIndustryErpModules(industry: Industry): string[] {
  return industry.erpModules ?? defaultErpModules;
}

export function getIndustryCustomOpportunities(industry: Industry): string[] {
  return industry.customSoftwareOpportunities ?? industry.capabilities;
}

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}
