import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function upsertPage(slug: string, title: string, sections: Array<{
  key: string;
  title?: string;
  subtitle?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sortOrder?: number;
  contentJson?: object;
}>) {
  const page = await prisma.websitePage.upsert({
    where: { slug },
    create: { slug, title, status: "published" },
    update: { title, status: "published" },
  });

  for (const s of sections) {
    await prisma.websiteSection.upsert({
      where: { pageId_key: { pageId: page.id, key: s.key } },
      create: {
        pageId: page.id,
        key: s.key,
        title: s.title,
        subtitle: s.subtitle,
        body: s.body,
        ctaLabel: s.ctaLabel,
        ctaHref: s.ctaHref,
        sortOrder: s.sortOrder ?? 0,
        contentJson: s.contentJson,
        isVisible: true,
      },
      update: {
        title: s.title,
        subtitle: s.subtitle,
        body: s.body,
        ctaLabel: s.ctaLabel,
        ctaHref: s.ctaHref,
        sortOrder: s.sortOrder ?? 0,
        contentJson: s.contentJson,
        isVisible: true,
      },
    });
  }

  await prisma.seoMetadata.upsert({
    where: { pageSlug: slug },
    create: {
      pageSlug: slug,
      pageId: page.id,
      title: `${title} | LoopC Business Strategies`,
      description:
        sections[0]?.subtitle || sections[0]?.body || sections[0]?.title || title,
      robots: "index,follow",
    },
    update: {
      pageId: page.id,
      title: `${title} | LoopC Business Strategies`,
    },
  });

  return page;
}

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      siteName: "LoopC Business Strategies",
      tagline: "Build Better. Operate Smarter. Grow Faster.",
      email: "hello@loopcstrategies.com",
      address: "OMR, Chennai, Tamil Nadu, India",
      footerText: "© LoopC Business Strategies. Technology built around the way your business works.",
      navJson: [
        { href: "/about", label: "About" },
        { href: "/services", label: "Services" },
        { href: "/erp", label: "ERP" },
        { href: "/pricing", label: "Pricing" },
        { href: "/contact", label: "Contact" },
      ],
    },
    update: {
      tagline: "Build Better. Operate Smarter. Grow Faster.",
      footerText: "© LoopC Business Strategies. Technology built around the way your business works.",
    },
  });

  await upsertPage("home", "Home", [
    {
      key: "hero",
      title: "Build Better. Operate Smarter. Grow Faster.",
      subtitle:
        "We design and build powerful digital products for modern businesses — from web and mobile applications to scalable SaaS platforms and business software.",
      ctaLabel: "Start a Project",
      ctaHref: "/contact?service=custom-software",
      sortOrder: 1,
      contentJson: {
        secondaryCtaLabel: "Explore ERP",
        secondaryCtaHref: "/erp",
        pills: ["Web apps", "Mobile apps", "SaaS", "ERP", "Dashboards", "APIs"],
      },
    },
    {
      key: "cta",
      title: "Ready to build software that works the way your business does?",
      subtitle: "Start with LoopC ERP or tell us about your project. We will help you find the right path.",
      ctaLabel: "Get Started",
      ctaHref: "/contact",
      sortOrder: 90,
    },
  ]);

  await upsertPage("about", "About", [
    {
      key: "hero",
      title: "We Build Technology Around the Way Businesses Work.",
      subtitle: "We are a technology team focused on creating practical, scalable and user-friendly digital products that help businesses operate better.",
      sortOrder: 1,
    },
    {
      key: "story",
      title: "From Business Problems to Digital Solutions",
      body: "Businesses often operate across spreadsheets, disconnected tools, manual processes and multiple systems. We believe technology should simplify that complexity.\n\nOur approach is simple: understand the problem, design the right experience, build reliable technology and continue improving it as the business grows.",
      sortOrder: 2,
    },
  ]);

  await upsertPage("solutions", "Solutions", [
    {
      key: "hero",
      title: "Software solutions for growing businesses.",
      subtitle:
        "LoopC ERP for connected operations — or custom software when your workflow needs something built around it.",
      sortOrder: 1,
    },
  ]);

  await upsertPage("industries", "Industries", [
    {
      key: "hero",
      title: "Technology that understands the business behind it.",
      subtitle:
        "We design software around how these operations run. These pages describe the problems we solve — not a claim that we are the only specialist in the vertical.",
      sortOrder: 1,
    },
  ]);

  await upsertPage("erp", "ERP", [
    {
      key: "intro",
      title: "One Powerful ERP for Your Entire Business",
      subtitle: "Bring your business operations together with a powerful ERP platform designed to help teams manage their everyday operations from one connected system.",
      ctaLabel: "View Pricing",
      ctaHref: "/pricing",
      sortOrder: 1,
      contentJson: {
        modules: [
          "Finance",
          "Accounting",
          "Inventory",
          "CRM",
          "HR",
          "Sales",
          "Purchasing",
          "Reports",
          "Business Management",
          "Role-based Access",
        ],
      },
    },
  ]);

  await upsertPage("features", "Features", [
    {
      key: "intro",
      title: "ERP features that match your plan",
      subtitle: "Modules unlock from your subscription — enforced on the server.",
      sortOrder: 1,
    },
  ]);

  const services = [
    {
      slug: "web-applications",
      name: "Web Applications",
      summary: "Custom web platforms designed for complex business workflows and scalable operations.",
      description: "Build scalable and high-performance web applications designed for your customers, teams and business operations.",
      sortOrder: 1,
      ctaHref: "/contact?service=web-application",
      ctaLabel: "Start a web project",
      featuresJson: ["Corporate websites", "Web applications", "SaaS platforms", "Customer portals", "Admin dashboards"],
    },
    {
      slug: "mobile-applications",
      name: "Mobile Applications",
      summary: "Modern mobile experiences for customers, employees and business operations.",
      description: "Create modern mobile experiences that connect your customers, employees and business processes.",
      sortOrder: 2,
      ctaHref: "/contact?service=mobile-app",
      ctaLabel: "Build a mobile app",
      featuresJson: ["Android", "iOS", "Cross-platform apps", "Business apps", "Customer apps"],
    },
    {
      slug: "saas-applications",
      name: "SaaS Applications",
      summary: "Cloud-based software products designed for scalability and recurring business models.",
      description: "Multi-tenant SaaS architecture with subscription billing, user management and scalable cloud infrastructure.",
      sortOrder: 3,
      ctaHref: "/contact?service=saas",
      ctaLabel: "Build a SaaS product",
      featuresJson: ["Multi-tenant architecture", "Subscription billing", "User management", "Scalable infrastructure"],
    },
    {
      slug: "business-dashboards",
      name: "Business Dashboards",
      summary: "Interactive dashboards that turn business data into clear and useful decisions.",
      description: "Real-time operational dashboards and analytics platforms built for business decision-making.",
      sortOrder: 4,
      ctaHref: "/contact",
      ctaLabel: "Build a dashboard",
      featuresJson: ["Real-time data", "Interactive charts", "Custom KPIs", "Mobile-ready"],
    },
    {
      slug: "custom-software",
      name: "Custom Software",
      summary: "Software designed specifically around your company's processes and requirements.",
      description: "Build software specifically around your business workflows instead of forcing your business into generic software.",
      sortOrder: 5,
      ctaHref: "/contact?service=custom-software",
      ctaLabel: "Discuss your requirements",
      featuresJson: ["Business management systems", "Internal tools", "Workflow systems", "Operations platforms"],
    },
    {
      slug: "erp-solutions",
      name: "ERP & Business Systems",
      summary: "Connected business systems that help organizations manage their operations more efficiently.",
      description: "LoopC ERP brings finance, inventory, CRM, HR and reporting into one connected system.",
      sortOrder: 6,
      ctaHref: "/erp",
      ctaLabel: "Explore LoopC ERP",
      featuresJson: ["Finance & accounting", "Inventory & sales", "CRM & HR", "Reports & analytics"],
    },
    {
      slug: "ui-ux-design",
      name: "UI/UX Design",
      summary: "Simple, intuitive and modern interfaces designed around real users.",
      description: "Design intuitive digital experiences that make complex products simple to understand and easy to use.",
      sortOrder: 7,
      ctaHref: "/contact?service=ui-ux",
      ctaLabel: "Start with design",
      featuresJson: ["User research", "Wireframes", "UI design", "Design systems", "Prototypes"],
    },
    {
      slug: "api-integrations",
      name: "API & Integrations",
      summary: "Connect applications, services and business workflows through reliable APIs and integrations.",
      description: "Connect your applications, services and business workflows with reliable APIs and integrations.",
      sortOrder: 8,
      ctaHref: "/contact?service=automation",
      ctaLabel: "Discuss integrations",
      featuresJson: ["REST APIs", "Payment integrations", "CRM integrations", "ERP integrations", "Data sync"],
    },
    {
      slug: "automation",
      name: "Automation",
      summary: "Reduce repetitive work and improve efficiency with intelligent business automation.",
      description: "Reduce repetitive manual work and improve operational efficiency through intelligent digital workflows.",
      sortOrder: 9,
      ctaHref: "/contact?service=automation",
      ctaLabel: "Automate your workflows",
      featuresJson: ["Workflow automation", "Document processing", "Scheduled jobs", "Business process integration"],
    },
  ];

  for (const svc of services) {
    await prisma.cmsService.upsert({
      where: { slug: svc.slug },
      create: { ...svc, isActive: true },
      update: { ...svc, isActive: true },
    });
  }

  const cat = await prisma.blogCategory.upsert({
    where: { slug: "product" },
    create: { slug: "product", name: "Product" },
    update: {},
  });

  await prisma.blogPost.upsert({
    where: { slug: "why-subscription-erp" },
    create: {
      slug: "why-subscription-erp",
      title: "Why businesses are moving to subscription ERP",
      excerpt: "Predictable pricing, faster onboarding, and modules that match how you work.",
      content:
        "Traditional ERP licenses often force businesses into packages they do not need. A subscription ERP lets you start with core finance and unlock inventory, CRM or HR when you are ready — with billing that stays transparent.",
      authorName: "LoopC Team",
      categoryId: cat.id,
      isPublished: true,
      publishedAt: new Date(),
      seoTitle: "Why subscription ERP | LoopC",
      seoDescription: "How SaaS ERP helps mid-market teams grow without shelf-ware.",
    },
    update: { isPublished: true, publishedAt: new Date() },
  });

  const faqs = [
    {
      question: "What is LoopC ERP?",
      answer: "LoopC ERP is a complete business management platform that brings finance, accounting, inventory, sales, CRM, HR, payroll and reporting into one connected system. It is available via subscription plans.",
    },
    {
      question: "How do I get access to LoopC ERP?",
      answer: "Choose a plan on our Pricing page, complete signup, and pay via our secure payment gateway. Once payment is confirmed, your ERP workspace is activated immediately.",
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes. You can upgrade immediately (prorated) or schedule a downgrade for the next billing cycle. Contact support or manage from your billing settings.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes. Eligible plans include a free trial period. You will only be charged at the end of the trial if you choose to continue.",
    },
    {
      question: "Do you build custom software too?",
      answer: "Yes. Besides LoopC ERP, we design and build custom web applications, mobile apps, SaaS products, dashboards and automation systems. Contact us to discuss your project.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major cards and UPI through our secure payment gateway (Razorpay). Payments are processed in INR.",
    },
    {
      question: "Is my business data secure?",
      answer: "Yes. Each company's data is fully isolated in a multi-tenant architecture. Access is controlled by role-based permissions, and all data is stored in a secure cloud database.",
    },
  ];

  await prisma.faqItem.deleteMany({ where: { pageSlug: "faq" } });
  await prisma.faqItem.createMany({
    data: faqs.map((f, i) => ({
      ...f,
      pageSlug: "faq",
      sortOrder: i + 1,
      isActive: true,
    })),
  });

  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      {
        quote: "LoopC understood our workflow before writing a line of code.",
        authorName: "Operations lead",
        authorRole: "Customer (demo)",
        companyName: "Demo quote — replace from Admin",
        rating: 5,
        isActive: true,
        sortOrder: 1,
      },
    ],
  });

  // Catalog of entitlements for the external ERP product (not in-app routes)
  const modules = [
    { key: "accounting", name: "Accounting", path: "external:accounting" },
    { key: "invoicing", name: "Invoicing", path: "external:invoicing" },
    { key: "inventory", name: "Inventory", path: "external:inventory" },
    { key: "crm", name: "CRM", path: "external:crm" },
    { key: "reports", name: "Reports", path: "external:reports" },
    { key: "hr", name: "HR", path: "external:hr" },
    { key: "payroll", name: "Payroll", path: "external:payroll" },
    { key: "api", name: "API", path: "external:api" },
  ];

  for (const [i, m] of modules.entries()) {
    await prisma.erpModule.upsert({
      where: { key: m.key },
      create: { ...m, sortOrder: i + 1, isActive: true },
      update: { ...m, isActive: true },
    });
  }

  await prisma.emailTemplate.upsert({
    where: { key: "contact_enquiry" },
    create: {
      key: "contact_enquiry",
      subject: "New LoopC website enquiry",
      bodyHtml:
        "<p>A new contact enquiry was submitted on the marketing website.</p><p>Review it in Admin → Website CMS → Contacts.</p>",
    },
    update: {
      subject: "New LoopC website enquiry",
    },
  });

  console.log("CMS seed complete (demo website content).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
