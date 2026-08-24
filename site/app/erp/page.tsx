import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { FadeIn } from "@/components/motion/fade-in";
import { ProductFrame } from "@/components/layout/product-frame";
import { Container } from "@/components/ui/container";
import { ErpValueProps } from "@/components/home/erp-showcase-section";
import {
  type ErpWebsitePage,
  type ErpFaqItem,
  asStringArray,
  erpFetch,
  getErpPublicUrl,
  sectionByKey,
} from "@/lib/erp-api";
import { getSalesCta } from "@/lib/navigation";
import { getBreadcrumbSchema, getFaqPageSchema, pageMetadata, pageSeo } from "@/lib/seo";
import { erpModules, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.erp.title,
  description: pageSeo.erp.description,
  path: "/erp",
});

type PagePayload = { page: ErpWebsitePage };
type FaqPayload = { faqs: ErpFaqItem[] };

export default async function ErpPage() {
  const erp = getErpPublicUrl();
  const salesCta = getSalesCta();
  const [data, faqData] = await Promise.all([
    erpFetch<PagePayload>("/api/public/pages/erp"),
    erpFetch<FaqPayload>("/api/public/faqs?page=erp"),
  ]);
  const intro = sectionByKey(data?.page?.sections, "intro");
  const modules = asStringArray(
    intro?.contentJson && typeof intro.contentJson === "object"
      ? (intro.contentJson as { modules?: unknown }).modules
      : null,
  );
  const faqs = faqData?.faqs ?? [];

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "ERP", path: "/erp" },
        ])}
      />
      {faqs.length > 0 ? <JsonLd data={getFaqPageSchema(faqs)} /> : null}

      <PageHero
        eyebrow="LoopC ERP"
        title={intro?.title || "One Powerful ERP for Your Entire Business"}
        description={
          intro?.subtitle ||
          siteConfig.positioning.erpCopy
        }
        dark
        backgroundImage="/images/page-heroes/erp.jpg"
      />

      <ErpValueProps />

      {/* What's included */}
      <section className="section-dark on-dark relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="type-label text-blue-300">What&apos;s included</p>
            <h2 className="type-h2 mt-3 font-bold text-white">
              Everything your business needs, connected.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              LoopC ERP is designed to replace disconnected tools with a single connected system —
              giving your team one place to manage the entire business.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {(modules.length ? modules : [...erpModules]).map((mod) => (
                <li
                  key={mod}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" aria-hidden />
                  {mod}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-blue-400"
              >
                View Pricing
              </Link>
              <Link
                href={salesCta.href}
                className="inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
              >
                {salesCta.label}
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <ProductFrame
              src="/images/hero/operations.png"
              alt="LoopC ERP operations dashboard with inventory, finance and activity"
              caption="loopc.app / erp"
            />
          </FadeIn>
        </Container>
      </section>

      {/* Modules grid */}
      <section className="bg-white py-20 sm:py-24">
        <Container>
          <FadeIn>
            <p className="type-label text-[var(--primary)]">ERP modules</p>
            <h2 className="type-h2 mt-3 max-w-xl font-bold text-slate-950">
              Start with what you need. Expand when you are ready.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              LoopC ERP is modular — finance, operations, people and reporting connected from day one.
            </p>
          </FadeIn>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[...erpModules].map((mod, i) => (
              <FadeIn key={mod} delay={i * 0.04}>
                <li className="lift-card premium-card rounded-2xl border border-slate-200/80 bg-[#f8faf9] px-4 py-4 text-center text-sm font-medium text-slate-800 shadow-sm">
                  {mod}
                </li>
              </FadeIn>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-slate-500">
            Module availability depends on your plan.{" "}
            <Link href="/pricing" className="font-semibold text-[var(--primary)] hover:underline">
              Compare pricing
            </Link>
          </p>
        </Container>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="section-light py-20 sm:py-24">
          <Container>
            <FadeIn>
              <p className="type-label text-[var(--primary)]">Frequently asked</p>
              <h2 className="type-h2 mt-3 max-w-xl font-bold text-slate-950">
                Questions about LoopC ERP
              </h2>
            </FadeIn>
            <dl className="mt-10 space-y-4">
              {faqs.map((faq, i) => (
                <FadeIn key={faq.id} delay={i * 0.05}>
                  <div className="lift-card premium-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <dt className="font-semibold text-slate-950">{faq.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</dd>
                  </div>
                </FadeIn>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="section-dark on-dark py-20 sm:py-24">
        <Container className="text-center">
          <FadeIn>
            <h2 className="type-h2 font-bold text-white">
              Ready to run your business on one platform?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Choose a plan and get access to LoopC ERP. No setup fees.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="inline-flex rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-400"
              >
                View Pricing
              </Link>
              <Link
                href={`${erp}/signup`}
                className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
              >
                Get Started Free
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
