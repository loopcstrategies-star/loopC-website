import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { techStack } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "LoopC Business Strategies — solutions-first, code-second. A software house that consults, builds web and mobile apps, and owns LoopC ERP.",
  openGraph: {
    title: `About | ${siteConfig.brand}`,
    description: "Why LoopC exists — understand the business, then build the software.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-60" />
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">About</p>
          <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            {siteConfig.name}
          </h1>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-8 space-y-6 text-lg leading-relaxed text-slate-600">
          <p>
            LoopC started from a simple observation: most businesses don&apos;t need another generic
            agency pitch — they need someone who understands their operation first, then builds the
            right software. That might be a marketing site, a mobile app, a custom dashboard, or our
            own ERP product with transparent plans.
          </p>
          <p>
            We&apos;re a <strong className="text-slate-900">software house that owns a product</strong>.
            Coacher Max — a live multi-tenant SaaS for tuition centers — is proof we don&apos;t just
            consult; we engineer, deploy, and run platforms in production. That credibility is rare
            among small agencies, and it&apos;s why clients trust us with both custom builds and LoopC
            ERP.
          </p>
          <p>
            Our philosophy is <strong className="text-slate-900">solutions-first, code-second</strong>.
            If a spreadsheet fix or process change solves the problem, we&apos;ll say so. When software
            is the answer, we scope honestly, demo working builds early, and deliver on Next.js,
            Flutter, NestJS, and PostgreSQL — a stack we use on our own products, not whatever is
            trendy this quarter.
          </p>
        </FadeIn>

        <FadeIn delay={0.14} className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Technology we ship on
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {techStack.map((t) => (
              <li
                key={t.name}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
              >
                {t.name}
                <span className="ml-2 text-xs font-normal text-slate-500">{t.category}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.16} className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            See our work
          </Link>
          <Link
            href="/services"
            className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            View services
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-105"
          >
            Talk to us
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
