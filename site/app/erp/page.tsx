import type { Metadata } from "next";
import Link from "next/link";
import { ErpPricingTable } from "@/components/erp-pricing-table";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { erpFeatureModules } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "LoopC ERP",
  description:
    "LoopC ERP — run your business from one dashboard. People, attendance, fees, scheduling, communication, and reports with transparent plans.",
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
        title="Run your business from one dashboard"
        description="Our own SaaS product — not a reseller. Core modules proven on live deployments like Coacher Max, with plans that scale from one branch to multi-site."
        priority
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Everything ops teams need in one place
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            LoopC ERP covers the modules we ship on real products — configurable for education,
            services, trading, and multi-branch operators.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {erpFeatureModules.map((mod, i) => (
            <FadeIn key={mod.title} delay={0.05 * i}>
              <article className="glass-panel h-full rounded-2xl p-6">
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Proof</p>
            <h2 className="font-display mt-3 text-2xl font-bold text-slate-900">
              Built and operated on real multi-tenant deployments
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Coacher Max runs on the same engineering discipline — mobile app, admin dashboard,
              payments, and role-based access at scale.
            </p>
            <Link
              href="/work/coacher-max"
              className="mt-6 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              Coacher Max case study →
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Plans & pricing</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Basic, Standard, Premium, or a custom build if your workflow needs more. Book a demo for
            exact numbers — tiers are transparent, not hidden behind a sales call.
          </p>
        </FadeIn>
        <div className="mt-12">
          <ErpPricingTable />
        </div>
        <FadeIn className="mt-12 text-center">
          <Link
            href="/free-demo"
            className="inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-105"
          >
            Start free demo / trial conversation
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
