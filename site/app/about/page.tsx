import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { deliveryProcess } from "@/lib/process";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "About LoopC | ERP & custom business software",
  description:
    "LoopC Business Strategies builds ERP and custom business software — designed around how companies actually work.",
  path: "/about",
});

const values = [
  {
    title: "Business first",
    copy: "We start with the workflow, the constraint and the user — not the technology trend.",
  },
  {
    title: "Simple by design",
    copy: "Software should feel obvious to the people who use it every day.",
  },
  {
    title: "Built to evolve",
    copy: "Products change as the business changes. We plan for that from day one.",
  },
  {
    title: "Long-term partnership",
    copy: "Launch is a delivery step. We stay on for support, improvements and the next release.",
  },
] as const;

export default function AboutPage() {
  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        eyebrow="About LoopC"
        title="Business software built around the way your business works."
        description={`${siteConfig.name} delivers LoopC ERP and custom software — from ${siteConfig.location.short}.`}
        dark
      />
      <Container className="max-w-3xl space-y-14 py-16 sm:py-20">
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">The problem we solve</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Growing businesses often run on spreadsheets, disconnected tools and manual hand-offs.
            Finance lives in one place, inventory in another, customers in a third. By the time
            leadership gets a clear picture, the week has already moved on.
          </p>
          <p className="mt-3 leading-relaxed text-slate-600">
            LoopC exists to bring that work into software — either through LoopC ERP or custom
            systems designed around your operations.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">The LoopC approach</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            We sit with the work first: approvals, exceptions, the Tuesday-morning rush. Then we
            choose the right product — ERP subscription, web application, mobile app or custom
            platform — and build it with a team that stays after go-live.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">How we deliver</h2>
          <ol className="mt-4 space-y-3">
            {deliveryProcess.map((step) => (
              <li key={step.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold text-teal-700">{step.num} · {step.title}</p>
                <p className="mt-1 text-sm text-slate-600">{step.summary}</p>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">What we stand for</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <li key={value.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{value.title}</p>
                <p className="mt-2 text-sm text-slate-600">{value.copy}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl bg-[#050b16] px-6 py-10 text-white">
          <h2 className="text-2xl font-semibold">Two ways to work with us</h2>
          <p className="mt-2 text-slate-300">
            Start with LoopC ERP or tell us what you need to build custom.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/erp"
              className="inline-flex rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              Explore LoopC ERP
            </Link>
            <Link
              href="/contact?intent=expert"
              className="inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Talk to an expert
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
