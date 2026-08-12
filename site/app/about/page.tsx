import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "About LoopC Business Strategies",
  description:
    "LoopC Business Strategies is a software development company on OMR, Chennai. We design and build digital products around how businesses actually work.",
  path: "/about",
});

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
        eyebrow="About"
        title="A technology partner, not a ticket queue."
        description={`${siteConfig.name} designs and builds software around the business — from ${siteConfig.location.short}.`}
        dark
      />
      <Container className="max-w-3xl space-y-10 py-16 sm:py-20">
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Why LoopC exists</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Most companies do not fail at software because they lack tools. They fail because the
            tools were designed for someone else’s process. LoopC exists to sit with the work —
            the approvals, the exceptions, the Tuesday-morning rush — and build products that
            fit.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">What we believe</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>The workflow is the spec. Screens come after.</li>
            <li>Launch is a delivery step, not the end of the relationship.</li>
            <li>We will not invent social proof or numbers we cannot stand behind.</li>
            <li>Clear language beats slogans. If we cannot explain it, we should not build it.</li>
          </ul>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">How we work</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            One team from strategy through support: UX, UI, development, testing, deployment.
            You speak to people who will still be on the product after go-live.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">What we build</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Mobile apps, websites, web applications, dashboards and custom business software. We
            also build our own products — Coacher Max for tuition centres is one. The company is
            a software studio first, not an ERP-only vendor.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Who we serve</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Operators and founders who have outgrown spreadsheets and chat groups. Trading,
            wholesale, distribution, manufacturing, retail, education and professional services
            are familiar shapes. If your process is specific, that is usually a reason to talk —
            not a reason to force a generic package.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Where we are</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{siteConfig.location.display}</p>
        </section>
        <Link
          href="/contact"
          className="inline-flex rounded-full bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Start a Project
        </Link>
      </Container>
    </div>
  );
}
