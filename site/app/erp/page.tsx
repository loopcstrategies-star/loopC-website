import type { Metadata } from "next";
import Link from "next/link";
import { ErpLivePreview } from "@/components/erp-live-preview";
import { ErpPricingTable } from "@/components/erp-pricing-table";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { erpIndustries } from "@/lib/home-content";
import { erpFeatureModules, erpModules } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "LoopC ERP",
  description:
    "LoopC ERP — run your business from one connected system. Accounting, inventory, sales, HR, reports — with Starter, Business and Enterprise plans.",
  openGraph: {
    title: `LoopC ERP | ${siteConfig.brand}`,
    description: "Our own ERP product — pick a plan or customize to your workflow.",
    url: "/erp",
  },
};

export default function ErpPage() {
  return (
    <div>
      <PageBanner
        banner="pricing"
        eyebrow="LoopC ERP"
        title="Run your business from one connected system"
        description="Our own SaaS product — not a reseller. Core modules for operations, finance and people, with plans that scale from one branch to multi-site."
        priority
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/free-demo"
            className="btn-primary interactive-shine inline-flex rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            Book a demo
          </Link>
          <Link
            href="#plans"
            className="btn-secondary inline-flex rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md"
          >
            View plans
          </Link>
        </div>
      </PageBanner>

      <section className="border-b border-white/5 bg-[#050b16] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ErpLivePreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Modules that connect your operation
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Accounting, inventory, sales, people and reports — one place for management and teams.
          </p>
        </FadeIn>
        <FadeIn delay={0.06} className="mt-8 flex flex-wrap gap-2">
          {erpModules.map((mod) => (
            <span
              key={mod}
              className="rounded-full border border-teal-100 bg-teal-50/80 px-3 py-1.5 text-sm font-medium text-teal-900"
            >
              {mod}
            </span>
          ))}
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {erpFeatureModules.map((mod, i) => (
            <FadeIn key={mod.title} delay={0.05 * i}>
              <article className="lift-card glass-panel h-full rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">{mod.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{mod.description}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-slate-50/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Industries</p>
            <h2 className="font-display mt-3 text-2xl font-bold text-slate-900">
              One platform. Different industries.
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {erpIndustries.map((ind, i) => (
              <FadeIn key={ind.title} delay={0.04 * i}>
                <article className="lift-card h-full rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-display text-base font-bold text-slate-900">{ind.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{ind.description}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Choose the ERP plan that fits your business.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Starter, Business, Enterprise — or a custom build if your workflow needs more. Book a
            demo for exact pricing.
          </p>
        </FadeIn>
        <div className="mt-12">
          <ErpPricingTable />
        </div>
        <FadeIn className="mt-12 text-center">
          <Link
            href="/free-demo"
            className="btn-primary inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25"
          >
            Request a demo
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
