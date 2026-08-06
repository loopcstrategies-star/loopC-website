import type { Metadata } from "next";
import Link from "next/link";
import { ErpPricingTable } from "@/components/erp-pricing-table";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "ERP Pricing",
  description:
    "LoopC ERP plans — Basic, Standard, Premium, and Custom Build. Transparent SaaS-style pricing for SMBs.",
  openGraph: {
    title: `ERP Pricing | ${siteConfig.brand}`,
    description: "Basic, Standard, Premium, and Custom Build tiers for LoopC ERP.",
    url: "/erp/pricing",
  },
};

export default function ErpPricingPage() {
  return (
    <div>
      <PageBanner
        banner="pricing"
        eyebrow="LoopC ERP"
        title="Plans that scale with your operation"
        description="Product-company pricing — not agency quotes. Pick a tier, book a demo, and we confirm users, storage, and modules for your branch count."
        priority
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <ErpPricingTable />

        <FadeIn className="mt-16 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Not sure which plan fits?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Start with a{" "}
            <Link href="/free-demo" className="font-semibold text-teal-700 hover:underline">
              free demo
            </Link>{" "}
            for LoopC ERP, or a{" "}
            <Link href="/free-audit" className="font-semibold text-teal-700 hover:underline">
              free audit
            </Link>{" "}
            if you need help deciding between ERP, custom web, or mobile.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/erp"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              ERP product overview
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Custom build services
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
