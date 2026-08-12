export type InsightPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  related: string[];
  body: { heading?: string; paragraphs: string[] }[];
};

export const insightAuthor = "LoopC Business Strategies";

export const insightPosts: InsightPost[] = [
  {
    slug: "when-your-business-needs-custom-software",
    title: "How to know when your business needs custom software",
    description:
      "A practical way to decide whether to keep stretching generic tools or build software around how your business actually works.",
    category: "Custom software",
    tags: ["custom software", "operations", "Chennai"],
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    readingMinutes: 7,
    related: ["erp-vs-custom-software", "how-to-choose-a-software-development-company"],
    body: [
      {
        paragraphs: [
          "Most businesses do not start with a software project. They start with a workaround. A spreadsheet that grew a tab every quarter. A chat group that became the official status board. A person who “just knows” where the file is.",
          "Custom software is worth considering when those workarounds start costing more than the work itself — in errors, delays, or the inability to see the business clearly.",
        ],
      },
      {
        heading: "Signs the current stack is the bottleneck",
        paragraphs: [
          "The same data is typed in more than once. Sales updates one sheet, operations another, and finance a third. Nobody trusts the number until someone reconciles it by hand.",
          "Approvals live in email. A rate, a credit limit, or a dispatch sits until the right person happens to see the message. There is no record of who approved what, or when.",
          "Training a new person takes weeks because the process is not in the system. It is in someone's head.",
          "Leaders ask for a simple picture — orders this week, stock at risk, collections due — and the answer is “we will have it by Friday.”",
        ],
      },
      {
        heading: "When you should not custom-build",
        paragraphs: [
          "If a well-supported product already fits 90% of the work, buy it and change the 10%. Custom software is for the shape of the business that products refuse to accept — unusual workflows, industry-specific rules, or a process that is the company's advantage.",
          "If the process itself is unclear, software will freeze the confusion. Get the workflow on a whiteboard first. Then decide what to build.",
        ],
      },
      {
        heading: "A useful test",
        paragraphs: [
          "Write down the job to be done in one sentence: “When X happens, we need Y to be true, without Z.” If you can say that clearly, a product conversation can start. If you cannot, you need discovery, not a quote for screens.",
          "LoopC works with businesses in Chennai and beyond that have outgrown generic tools and need software designed around the work. The first conversation is about the process, not the stack.",
        ],
      },
    ],
  },
  {
    slug: "website-vs-web-application",
    title: "Website vs web application: which does your business actually need?",
    description:
      "A clear distinction between a marketing website and a web application — and how to choose without buying the wrong thing.",
    category: "Web",
    tags: ["websites", "web applications", "product"],
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    readingMinutes: 6,
    related: ["when-should-a-company-build-a-mobile-app", "what-makes-a-good-business-application"],
    body: [
      {
        paragraphs: [
          "These two are often quoted together and they are not the same job. A website explains. A web application does work.",
          "If visitors need to understand you, find you, and get in touch, you need a website. If people need to log in, complete a workflow, and come back tomorrow, you need a web application. Many companies need both.",
        ],
      },
      {
        heading: "What a website is for",
        paragraphs: [
          "A website is for credibility, discovery and conversion. It should load quickly, read clearly on a phone, and make the next step obvious. SEO, structure and content matter more than a login.",
          "If your current site is slow, vague, or built like a brochure from ten years ago, rebuilding the website is a marketing and trust problem — not an ERP problem.",
        ],
      },
      {
        heading: "What a web application is for",
        paragraphs: [
          "A web application has accounts, roles and data that change. Customer portals, admin dashboards, SaaS products, internal tools — these are applications. They need authentication, permissions, validation and a plan for change after launch.",
          "Pricing a web application like a five-page website is how projects fail. The work is product design plus engineering, not “a few extra pages.”",
        ],
      },
      {
        heading: "How LoopC usually scopes this",
        paragraphs: [
          "We separate the public site from the product. The site can launch earlier. The application follows the workflow. When they share a design system, the company still feels like one brand.",
          "If you are unsure which you are buying, start with the user: are they a visitor, or an operator?",
        ],
      },
    ],
  },
  {
    slug: "how-business-dashboards-improve-decisions",
    title: "How business dashboards improve decision making",
    description:
      "Why a dashboard is not a chart gallery — and how to design views leadership will actually open.",
    category: "Dashboards",
    tags: ["dashboards", "operations", "reporting"],
    publishedAt: "2026-06-15",
    updatedAt: "2026-06-15",
    readingMinutes: 6,
    related: ["how-to-build-a-business-dashboard", "when-your-business-needs-custom-software"],
    body: [
      {
        paragraphs: [
          "A dashboard fails when it tries to show everything. People close the tab and go back to asking someone for a number.",
          "A useful dashboard answers a small set of questions that already exist in the business: Are we on plan? Where is work stuck? What needs a decision today?",
        ],
      },
      {
        heading: "Start with the decision, not the chart",
        paragraphs: [
          "Sit with the person who currently compiles the report. Ask what they look at first, what they ignore, and what they wish they knew before the meeting. That list is the dashboard.",
          "Revenue, orders, outstanding, stock at risk, jobs in progress — pick the few that change what someone does this afternoon. Everything else can live in a filtered report.",
        ],
      },
      {
        heading: "Trust is the real feature",
        paragraphs: [
          "If the number on the screen does not match the number in the other system, the dashboard is worse than nothing. Integrations, definitions and refresh time matter more than colour.",
          "Show when the data was last updated. Show who the figure is for. Make it possible to drill into the rows, or people will assume it is decoration.",
        ],
      },
      {
        heading: "What LoopC builds",
        paragraphs: [
          "We build dashboards connected to real operational data — not a slide of sample charts. Filters, roles and exports are part of the product. Demo numbers on our website are labelled as concepts. Your dashboard should not be.",
        ],
      },
    ],
  },
  {
    slug: "when-should-a-company-build-a-mobile-app",
    title: "When should a company build a mobile app?",
    description:
      "A grounded checklist for when a mobile app is the right product — and when a good mobile website is enough.",
    category: "Mobile",
    tags: ["mobile apps", "product strategy"],
    publishedAt: "2026-06-22",
    updatedAt: "2026-06-22",
    readingMinutes: 6,
    related: ["website-vs-web-application", "what-makes-a-good-business-application"],
    body: [
      {
        paragraphs: [
          "An app is not a badge of modernity. It is a product people have to install, update and remember. Build one when the work happens in the hand, repeatedly, and a browser tab is a poor fit.",
        ],
      },
      {
        heading: "Good reasons to build an app",
        paragraphs: [
          "Field teams need to capture work away from a desk — deliveries, attendance, inspections, collections.",
          "Customers return often: bookings, orders, class schedules, service status. Notifications matter.",
          "Offline or camera, location and device features are part of the job, not a nice-to-have.",
        ],
      },
      {
        heading: "Poor reasons",
        paragraphs: [
          "“Our competitor has one.” “It will make us look premium.” “We want to be on the App Store.” Those are not jobs to be done. A fast mobile website with a clear enquiry path may be the whole need.",
          "If the content is mostly reading and a contact form, start with the website. You can add an app when the behaviour is there.",
        ],
      },
      {
        heading: "How we approach it",
        paragraphs: [
          "LoopC builds Android and iOS apps with Flutter or React Native when a shared codebase fits, and native pieces when the product needs them. The conversation starts with who opens the app on a Tuesday morning, and what they must finish before they put the phone away.",
        ],
      },
    ],
  },
  {
    slug: "erp-vs-custom-software",
    title: "ERP vs custom software",
    description:
      "When a packaged ERP is the right buy, when custom software is the better fit, and how to avoid paying for both badly.",
    category: "Custom software",
    tags: ["ERP", "custom software", "operations"],
    publishedAt: "2026-06-29",
    updatedAt: "2026-06-29",
    readingMinutes: 8,
    related: ["when-your-business-needs-custom-software", "how-to-automate-manual-business-processes"],
    body: [
      {
        paragraphs: [
          "ERP and custom software are often presented as rivals. They solve different shapes of the same problem: making the business run in one system instead of ten files.",
          "An ERP assumes your process is close to a known model — accounting, inventory, sales, purchase, HR — and that you will adapt the business a little to the product. Custom software assumes the process is the point, and the software should follow it.",
        ],
      },
      {
        heading: "Buy ERP when the model already fits",
        paragraphs: [
          "If your operations are standard, a well-implemented packaged system can be faster than inventing one. You still need implementation, training and discipline. The product does not run itself.",
          "The failure mode is buying forty modules and using six, then hiring people to feed the other thirty.",
        ],
      },
      {
        heading: "Build custom when the process is the advantage",
        paragraphs: [
          "If your workflow, pricing, approvals or industry rules are why customers stay, forcing that into a generic ERP is expensive twice: once in licenses, again in workarounds.",
          "Custom software is not “more unique for its own sake.” It is a system whose data model matches how you actually sell, store, make or serve.",
        ],
      },
      {
        heading: "LoopC’s position",
        paragraphs: [
          "LoopC is a software development company. We build custom systems, dashboards, web and mobile products. We can include ERP-like capabilities — inventory, orders, accounting views, approvals — inside software designed for your business. We do not ask you to become an ERP customer in order to get a working operation.",
          "If a packaged ERP is genuinely the better buy, we will say so. The job is a working business system, not a particular label on the box.",
        ],
      },
    ],
  },
  {
    slug: "how-to-automate-manual-business-processes",
    title: "How to automate manual business processes",
    description:
      "A sequence for automating real work: map, remove, connect, then software — without automating a mess.",
    category: "Automation",
    tags: ["automation", "operations", "integrations"],
    publishedAt: "2026-07-06",
    updatedAt: "2026-07-06",
    readingMinutes: 7,
    related: ["erp-vs-custom-software", "how-to-build-a-business-dashboard"],
    body: [
      {
        paragraphs: [
          "Automation is not a robot. It is the decision that a repeated path should not depend on someone remembering to copy a cell.",
          "The businesses that get value from automation pick one painful loop, make it boring, and only then add the next loop.",
        ],
      },
      {
        heading: "Map the work as it is, not as the SOP says",
        paragraphs: [
          "Follow one real case from start to finish. Who touches it? What do they wait on? Where does the file fork? The unofficial steps are the process.",
          "If two people do the same job differently, software will pick a fight. Align the path before you encode it.",
        ],
      },
      {
        heading: "Remove before you connect",
        paragraphs: [
          "Some steps exist because a previous tool was missing. If a status email is only there because the system cannot notify, do not automate the email — fix the system.",
          "Keep a human on exceptions: credit over a limit, a damaged return, a one-off customer. Automate the eighty percent that is the same every time.",
        ],
      },
      {
        heading: "Then connect and measure",
        paragraphs: [
          "APIs, webhooks and scheduled jobs should move data with an audit trail. Measure cycle time and error rate on the loop you touched. If you cannot see a change, you automated theatre.",
          "LoopC maps processes, then builds the software and integrations to run them. We do not start with a tool catalogue.",
        ],
      },
    ],
  },
  {
    slug: "how-to-choose-a-software-development-company",
    title: "How to choose a software development company",
    description:
      "What to look for in a software partner in Chennai or anywhere else — beyond a pitch deck and a stack list.",
    category: "Working with LoopC",
    tags: ["vendor selection", "Chennai", "process"],
    publishedAt: "2026-07-13",
    updatedAt: "2026-07-13",
    readingMinutes: 7,
    related: ["when-your-business-needs-custom-software", "digital-transformation-for-growing-businesses"],
    body: [
      {
        paragraphs: [
          "The wrong partner is expensive even when the hourly rate looks low. You pay in rebuilds, in missed edge cases, and in a product nobody on your side understands.",
          "A good software company talks about your process before they talk about theirs.",
        ],
      },
      {
        heading: "Listen for the questions they ask",
        paragraphs: [
          "Who uses this on a busy day? What happens when the happy path fails? What must never be wrong — money, stock, attendance, permissions? If the conversation stays on screens and logos, keep looking.",
        ],
      },
      {
        heading: "Ask how they will work with you",
        paragraphs: [
          "You should know who you will speak to, how decisions get recorded, and what “done” means for the first release. A vague “agile” without a discovery and a scoped first slice is a way to start spending without a shared target.",
          "Look at real work, not stock case studies. One honest product with a clear story beats ten anonymous logos.",
        ],
      },
      {
        heading: "Location and language",
        paragraphs: [
          "LoopC is based on OMR in Chennai. Being able to sit with the operations team still matters for this kind of work. The stack — React, Next.js, Flutter, Node — is in service of the product, not the other way around.",
          "Choose a partner who will still be interested after launch. Software that is used will need a next version.",
        ],
      },
    ],
  },
  {
    slug: "digital-transformation-for-growing-businesses",
    title: "Digital transformation for growing businesses",
    description:
      "A smaller, more honest version of digital transformation: replace the worst manual loops first.",
    category: "Strategy",
    tags: ["digital transformation", "growing businesses"],
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    readingMinutes: 6,
    related: ["how-to-automate-manual-business-processes", "how-to-choose-a-software-development-company"],
    body: [
      {
        paragraphs: [
          "“Digital transformation” is often sold as a programme. For a growing business it is usually a sequence of replacements: the worst spreadsheet, the noisiest chat-group process, the report that takes three days.",
          "The companies that get stuck try to digitise everything at once and ship nothing anyone will use.",
        ],
      },
      {
        heading: "Pick the loop that hurts",
        paragraphs: [
          "Order to cash. Stock to dispatch. Enquiry to admission. Job to invoice. Choose one loop with a clear owner and a visible cost of failure. Build the smallest system that makes that loop reliable.",
          "When that is in daily use, the next loop is obvious. People will tell you. That is a better roadmap than a 40-page vision document.",
        ],
      },
      {
        heading: "People still run the business",
        paragraphs: [
          "Software does not remove the need for a decision. It makes the decision visible and the follow-through less dependent on one person's memory. Training, permissions and a go-live plan are part of the work.",
          "LoopC builds that sequence with businesses that are past ad-hoc tools and not interested in theatre. OMR, Chennai is where we sit. The product is what your team will open on Monday.",
        ],
      },
    ],
  },
  {
    slug: "how-to-build-a-business-dashboard",
    title: "How to build a business dashboard",
    description:
      "A working method: questions, definitions, data sources, then charts — in that order.",
    category: "Dashboards",
    tags: ["dashboards", "analytics", "product"],
    publishedAt: "2026-07-27",
    updatedAt: "2026-07-27",
    readingMinutes: 6,
    related: ["how-business-dashboards-improve-decisions", "what-makes-a-good-business-application"],
    body: [
      {
        paragraphs: [
          "Building a dashboard backwards — charts first, meaning later — produces a wall of colour. Building it forwards produces a tool.",
        ],
      },
      {
        heading: "Write the questions",
        paragraphs: [
          "Three to seven questions for a given role. A sales head and a store manager should not share the same home screen. If they need the same number, they still need different context.",
        ],
      },
      {
        heading: "Define the number",
        paragraphs: [
          "“Revenue” means invoice date or collection date? “Orders” include cancelled? “Stock” is sellable or all? Write the definition next to the widget. Then find the source system that can support it. If it cannot, say so — do not invent a formula that looks precise.",
        ],
      },
      {
        heading: "Then design the view",
        paragraphs: [
          "KPIs on top, a trend, a table you can filter, an export. Default to the period people already use (today, this week, this month). Make empty and error states honest.",
          "LoopC builds dashboards as products: roles, filters, connections to live data. The sample boards on our site are labelled as UI concepts. Yours should be connected to your books and operations.",
        ],
      },
    ],
  },
  {
    slug: "what-makes-a-good-business-application",
    title: "What makes a good business application?",
    description:
      "The qualities that separate software people keep using from software they open once and abandon.",
    category: "Product",
    tags: ["product", "UX", "custom software"],
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    readingMinutes: 6,
    related: ["website-vs-web-application", "when-your-business-needs-custom-software"],
    body: [
      {
        paragraphs: [
          "A good business application disappears into the day. People finish the task and do not talk about the software. A poor one becomes a meeting topic forever.",
        ],
      },
      {
        heading: "It matches the job",
        paragraphs: [
          "Fields, statuses and permissions reflect how the work is done. Optional fields that nobody understands are worse than missing features. The empty state tells you what to do next.",
        ],
      },
      {
        heading: "It is fast enough to trust",
        paragraphs: [
          "If saving an order feels like waiting for a printer, people will keep a side sheet. Performance is a product feature. So is a clear error: what went wrong, and what to do.",
        ],
      },
      {
        heading: "It can change",
        paragraphs: [
          "The first release will miss something. A good application is structured so the next workflow, report or role does not require a rewrite. That is design and engineering together, not a promise on a slide.",
          "LoopC designs and builds business applications — web and mobile — with that bar: used daily, understood by the people who run the company, and ready for the next version.",
        ],
      },
    ],
  },
];

export function getInsight(slug: string): InsightPost | undefined {
  return insightPosts.find((post) => post.slug === slug);
}

export function getRelatedInsights(slug: string): InsightPost[] {
  const post = getInsight(slug);
  if (!post) return [];
  return post.related
    .map((relatedSlug) => getInsight(relatedSlug))
    .filter((item): item is InsightPost => Boolean(item));
}

export function formatInsightDate(iso: string): string {
  return new Date(`${iso}T00:00:00.000Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
