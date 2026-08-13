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
      tagline: "Powerful software for businesses that want to grow.",
      email: "hello@loopcstrategies.com",
      address: "OMR, Chennai, Tamil Nadu, India",
      footerText: "© LoopC Business Strategies. Software studio & SaaS ERP.",
      navJson: [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/services", label: "Services" },
        { href: "/erp", label: "ERP" },
        { href: "/pricing", label: "Pricing" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
      ],
    },
    update: {},
  });

  await upsertPage("home", "Home", [
    {
      key: "hero",
      title: "Powerful software for businesses that want to grow.",
      subtitle:
        "Build, automate and manage your business with modern ERP and custom digital solutions.",
      ctaLabel: "Explore ERP",
      ctaHref: "http://localhost:3001/pricing",
      sortOrder: 1,
      contentJson: {
        secondaryCtaLabel: "Talk to Us",
        secondaryCtaHref: "/contact",
      },
    },
    {
      key: "cta",
      title: "Ready to run your business on modern software?",
      subtitle: "Start with LoopC ERP or talk to us about a custom build.",
      ctaLabel: "Get Started",
      ctaHref: "http://localhost:3001/pricing",
      sortOrder: 90,
    },
  ]);

  await upsertPage("about", "About", [
    {
      key: "intro",
      title: "About LoopC Business Strategies",
      subtitle: "A software studio on OMR, Chennai.",
      body: "We design and build ERP, SaaS products, websites, mobile apps and automation systems around how businesses actually work.",
      sortOrder: 1,
    },
    {
      key: "mission",
      title: "Mission",
      body: "Help businesses grow with practical software — not shelf-ware.",
      sortOrder: 2,
    },
    {
      key: "vision",
      title: "Vision",
      body: "Become the technology partner Indian mid-market companies trust for long-term digital products.",
      sortOrder: 3,
    },
  ]);

  await upsertPage("erp", "ERP", [
    {
      key: "intro",
      title: "LoopC ERP",
      subtitle: "One workspace for accounting, inventory, CRM, HR and more.",
      body: "Subscribe to unlock modules by plan. Multi-tenant, subscription-gated, and managed from a single admin control center.",
      ctaLabel: "View pricing",
      ctaHref: "http://localhost:3001/pricing",
      sortOrder: 1,
      contentJson: {
        modules: [
          "Accounting",
          "Inventory",
          "CRM",
          "Sales",
          "Purchasing",
          "HR",
          "Payroll",
          "Invoicing",
          "Reports",
          "Business Analytics",
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
      slug: "erp-solutions",
      name: "ERP Solutions",
      summary: "Subscribe to LoopC ERP and run operations in one place.",
      description: "Accounting, inventory, CRM, HR and more — gated by plan.",
      sortOrder: 1,
      ctaHref: "http://localhost:3001/pricing",
      ctaLabel: "Explore ERP",
      featuresJson: ["Multi-tenant", "Subscription billing", "Role-based access"],
    },
    {
      slug: "custom-software",
      name: "Custom Software",
      summary: "Software designed around your workflows.",
      description: "From internal tools to customer portals.",
      sortOrder: 2,
      ctaHref: "/contact",
      ctaLabel: "Talk to Us",
      featuresJson: ["Discovery", "UX/UI", "Build & support"],
    },
    {
      slug: "web-development",
      name: "Web Development",
      summary: "High-performance websites and web apps.",
      sortOrder: 3,
      ctaHref: "/contact",
      featuresJson: ["Next.js", "SEO-ready", "CMS-friendly"],
    },
    {
      slug: "mobile-apps",
      name: "Mobile Apps",
      summary: "Native-quality apps for customers and field teams.",
      sortOrder: 4,
      ctaHref: "/contact",
      featuresJson: ["iOS & Android", "Offline-ready patterns"],
    },
    {
      slug: "saas-products",
      name: "SaaS Products",
      summary: "Multi-tenant products with billing and roles.",
      sortOrder: 5,
      ctaHref: "/contact",
      featuresJson: ["Subscriptions", "Tenancy", "Admin panels"],
    },
    {
      slug: "ai-automation",
      name: "AI & Automation",
      summary: "Automate repetitive work and connect systems.",
      sortOrder: 6,
      ctaHref: "/contact",
      featuresJson: ["Workflows", "Integrations", "Assistants"],
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
      answer: "A multi-tenant SaaS ERP with plan-gated modules for accounting, inventory, CRM, HR and more.",
    },
    {
      question: "Can I change plans later?",
      answer: "Yes. Upgrade immediately (prorated) or schedule a downgrade for the next billing cycle.",
    },
    {
      question: "Do you build custom software too?",
      answer: "Yes. LoopC also builds websites, mobile apps, SaaS products and automation systems.",
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

  const modules = [
    { key: "accounting", name: "Accounting", path: "/app/accounting" },
    { key: "invoicing", name: "Invoicing", path: "/app/invoicing" },
    { key: "inventory", name: "Inventory", path: "/app/inventory" },
    { key: "crm", name: "CRM", path: "/app/crm" },
    { key: "reports", name: "Reports", path: "/app/reports" },
    { key: "hr", name: "HR", path: "/app/hr" },
    { key: "payroll", name: "Payroll", path: "/app/payroll" },
    { key: "api", name: "API", path: "/app/api-keys" },
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
