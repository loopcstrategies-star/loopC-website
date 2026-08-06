import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { serviceTracks } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Business consulting, custom web development, mobile apps, and LoopC ERP — four ways LoopC helps you go from problem to product.",
  openGraph: {
    title: `Services | ${siteConfig.brand}`,
    description: "Consulting, web, mobile, and ERP — whichever fits where you are.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-70" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Services</p>
          <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            We work in three ways — whichever fits where you are
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            {siteConfig.name} is a software house, not a slide-deck agency. We diagnose business
            problems first, then recommend consulting, a custom build, or our own ERP product —
            without overselling what you don&apos;t need.
          </p>
        </FadeIn>

        <div className="mt-16 space-y-12">
          {serviceTracks.map((track, i) => (
            <FadeIn key={track.id} delay={0.06 * i}>
              <article id={track.id} className="glass-panel scroll-mt-24 rounded-3xl p-8 sm:p-10">
                <h2 className="font-display text-2xl font-bold text-slate-900">{track.title}</h2>
                <p className="mt-2 text-sm font-medium text-teal-700">Who this is for: {track.whoFor}</p>
                <ul className="mt-6 space-y-3">
                  {track.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-600">
                      <span
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400"
                        aria-hidden
                      />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">Typical timeline: </span>
                  {track.timeline}
                </p>
                {track.id === "erp-product" ? (
                  <Link
                    href="/erp"
                    className="mt-6 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-800"
                  >
                    LoopC ERP product page →
                  </Link>
                ) : null}
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16">
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">Not sure where to start?</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Book a free demo for ERP, or tell us what you need — website, mobile app, or ERP — and
                we&apos;ll route you to the right track.
              </p>
            </div>
            <Link
              href="/free-demo"
              className="inline-flex shrink-0 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-105"
            >
              Book a free demo
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
