import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { caseStudies } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Work",
  description: `Software we've built and run — case studies from ${siteConfig.name}.`,
  openGraph: {
    title: `Work | ${siteConfig.brand}`,
    description: "Portfolio and case studies — custom web, mobile, and SaaS platforms.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Work</p>
          <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            We build it. We run it.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Depth over breadth — each project shows how we diagnose a business problem and ship
            software that sticks: web, mobile, backend, and multi-tenant SaaS.
          </p>
        </FadeIn>
        <div className="mt-14 grid gap-8">
          {caseStudies.map((study, i) => (
            <FadeIn key={study.slug} delay={0.06 * i}>
              <article className="glass-panel overflow-hidden rounded-3xl lg:flex">
                <div className="flex flex-1 flex-col p-8 sm:p-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    {study.sector}
                  </span>
                  <h2 className="font-display mt-2 text-2xl font-bold text-slate-900">{study.title}</h2>
                  <p className="mt-4 text-sm font-medium text-slate-700">Problem</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{study.problem}</p>
                  <p className="mt-4 text-sm font-medium text-slate-700">Result</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{study.outcome}</p>
                  {study.metrics ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {study.metrics.map((m) => (
                        <li
                          key={m}
                          className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <Link
                    href={`/work/${study.slug}`}
                    className="mt-6 inline-flex w-fit rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                  >
                    Read full case study
                  </Link>
                </div>
                <div className="border-t border-teal-100/60 bg-slate-900 p-8 text-white lg:w-64 lg:border-t-0 lg:border-l">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-300">Tech</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {study.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-14 text-center">
          <p className="text-slate-600">Your project could be next.</p>
          <Link
            href="/free-demo"
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 hover:brightness-105"
          >
            Book a free demo
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
