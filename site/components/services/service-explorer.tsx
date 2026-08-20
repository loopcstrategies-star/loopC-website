"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ServiceItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  cta: { label: string; href: string };
};

const explorerServices: ServiceItem[] = [
  {
    id: "web",
    label: "Web Apps",
    title: "Web Applications",
    description:
      "Build scalable and high-performance web applications designed for your customers, teams and business operations.",
    features: [
      "Corporate websites and product sites",
      "Web applications and SaaS platforms",
      "Customer portals and admin dashboards",
      "Business platforms and management systems",
    ],
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Tailwind"],
    cta: { label: "Start a web project", href: "/contact?service=web-application" },
  },
  {
    id: "mobile",
    label: "Mobile",
    title: "Mobile Applications",
    description:
      "Create modern mobile experiences that connect your customers, employees and business processes.",
    features: [
      "Android and iOS applications",
      "Cross-platform apps with Flutter or React Native",
      "Business and employee apps",
      "Customer-facing mobile products",
    ],
    technologies: ["Flutter", "React Native", "iOS", "Android", "Firebase"],
    cta: { label: "Build a mobile app", href: "/contact?service=mobile-app" },
  },
  {
    id: "saas",
    label: "SaaS",
    title: "SaaS Applications",
    description:
      "Cloud-based software products designed for scalability and recurring business models.",
    features: [
      "Multi-tenant SaaS architecture",
      "Subscription billing integration",
      "User management and permissions",
      "Scalable cloud infrastructure",
    ],
    technologies: ["Next.js", "Stripe / Razorpay", "PostgreSQL", "Redis", "AWS"],
    cta: { label: "Build a SaaS product", href: "/contact?service=saas" },
  },
  {
    id: "custom",
    label: "Custom Software",
    title: "Custom Software",
    description:
      "Build software specifically around your business workflows instead of forcing your business into generic software.",
    features: [
      "Business management systems",
      "Internal tools and workflow systems",
      "Operations platforms",
      "Custom business applications",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "REST APIs"],
    cta: { label: "Discuss your requirements", href: "/contact?service=custom-software" },
  },
  {
    id: "uiux",
    label: "UI/UX",
    title: "UI/UX Design",
    description:
      "Design intuitive digital experiences that make complex products simple to understand and easy to use.",
    features: [
      "User research and discovery",
      "Wireframes and prototypes",
      "UI design and design systems",
      "UX audits and improvements",
    ],
    technologies: ["Figma", "Prototyping", "Design Systems", "Usability Testing"],
    cta: { label: "Start with design", href: "/contact?service=ui-ux" },
  },
  {
    id: "api",
    label: "API",
    title: "API & Integrations",
    description:
      "Connect your applications, services and business workflows with reliable APIs and integrations.",
    features: [
      "REST and GraphQL APIs",
      "Payment and CRM integrations",
      "ERP and third-party integrations",
      "Data synchronization pipelines",
    ],
    technologies: ["REST APIs", "GraphQL", "Webhooks", "Node.js", "PostgreSQL"],
    cta: { label: "Discuss integrations", href: "/contact?service=automation" },
  },
  {
    id: "automation",
    label: "Automation",
    title: "Business Automation",
    description:
      "Reduce repetitive manual work and improve operational efficiency through intelligent digital workflows.",
    features: [
      "Workflow automation",
      "Document processing",
      "Scheduled jobs and triggers",
      "Business process integration",
    ],
    technologies: ["Node.js", "Python", "Zapier", "n8n", "Custom pipelines"],
    cta: { label: "Automate your workflows", href: "/contact?service=automation" },
  },
  {
    id: "support",
    label: "Support",
    title: "Support & Maintenance",
    description:
      "Keep your digital products secure, updated, optimized and reliable after launch.",
    features: [
      "Bug fixes and performance improvements",
      "Security updates and patches",
      "New feature development",
      "Monitoring and uptime management",
    ],
    technologies: ["All platforms", "CI/CD", "Monitoring", "Cloud"],
    cta: { label: "Get support", href: "/contact" },
  },
];

export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = explorerServices[active];

  return (
    <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 lg:w-52 lg:flex-col lg:flex-nowrap lg:shrink-0">
        {explorerServices.map((service, i) => (
          <button
            key={service.id}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium text-left transition-all duration-150 ${
              active === i
                ? "bg-teal-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800"
            }`}
          >
            {service.label}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? {} : { opacity: 0, x: 12 }}
            animate={reduce ? {} : { opacity: 1, x: 0 }}
            exit={reduce ? {} : { opacity: 0, x: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-slate-950">{current.title}</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{current.description}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold tracking-widest text-teal-600">What's included</p>
                <ul className="mt-3 space-y-2">
                  {current.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-0.5 shrink-0 text-teal-500" aria-hidden>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-teal-600">Technologies</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {current.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={current.cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                {current.cta.label}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
