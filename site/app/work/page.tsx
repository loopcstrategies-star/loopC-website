import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { caseStudies, techGroups } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Work",
  description: `Selected work from ${siteConfig.name} — ERP platforms, mobile apps, and custom business systems.`,
  openGraph: {
    title: `Work | ${siteConfig.brand}`,
    description: "Built for real businesses — case studies and selected work.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <div>
      <PageBanner
        banner="work"
        eyebrow="Selected work"
        title="Technology we've built for real business needs"
        description="Depth over breadth — each project shows how we diagnose a business problem and ship software that sticks."
        priority
      >
        <Link
          href="/contact"
          className="btn-primary interactive-shine inline-flex rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-6 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Start a project
        </Link>
      </PageBanner>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-8">
          {caseStudies.map((study, i) => (
            <FadeIn key={study.slug} delay={0.06 * i}>
              <article className="work-card lift-card glass-panel overflow-hidden rounded-3xl lg:grid lg:grid-cols-2">
                <div className="work-media relative min-h-[240px] bg-slate-900">
                  {study.image ? (
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="work-media-zoom object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>
                <div className="work-caption flex flex-col justify-center p-8 sm:p-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    {study.sector}
                  </span>
                  <h2 className="font-display mt-2 text-2xl font-bold text-slate-900">{study.title}</h2>
                  <p className="mt-4 text-sm font-medium text-slate-700">The challenge</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{study.problem}</p>
                  <p className="mt-4 text-sm font-medium text-slate-700">Our solution</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{study.outcome}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {study.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/work/${study.slug}`}
                    className="btn-primary mt-6 inline-flex w-fit rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                  >
                    View case study →
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1} className="mt-16">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            From disconnected processes to one connected operation.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-red-700">Before</p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>Multiple tools</li>
                <li>Spreadsheets</li>
                <li>Manual processes</li>
                <li>Disconnected data</li>
                <li>Limited visibility</li>
              </ul>
            </div>
            <p className="text-center text-2xl text-teal-600" aria-hidden>
              →
            </p>
            <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">After</p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>Centralized platform</li>
                <li>Automated workflows</li>
                <li>Connected data</li>
                <li>Real-time visibility</li>
                <li>Better management control</li>
              </ul>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mt-20 border-t border-slate-200 pt-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Our technology
          </p>
          <h2 className="font-display mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Modern technology. Practical engineering.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            We choose technologies based on product requirements, scalability, performance and
            long-term maintainability.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {techGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <ul className="mt-2 space-y-1 text-sm font-medium text-slate-800">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
