import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { PathForkArt } from "@/components/section-illustrations";
import { businessFlow, customVsErp } from "@/lib/home-content";
import { serviceTracks } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web applications, mobile apps, ERP solutions, custom software, UI/UX, testing & QA, and maintenance — end-to-end from LoopC.",
  openGraph: {
    title: `Services | ${siteConfig.brand}`,
    description: "Custom software and product development — web, mobile, ERP, and more.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <div>
      <PageBanner
        banner="services"
        eyebrow="Services"
        title="Custom software. End-to-end."
        description="Web applications, mobile apps, ERP solutions, UI/UX, testing, deployment and support — one team from idea to launch."
        priority
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="btn-primary interactive-shine inline-flex rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            Start a project
          </Link>
          <Link
            href="/erp"
            className="btn-secondary inline-flex rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md"
          >
            Explore LoopC ERP
          </Link>
        </div>
      </PageBanner>

      <section className="relative overflow-hidden bg-[#050b16] py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,rgba(20,184,166,0.16),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
                Custom software development
              </p>
              <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your business is unique. Your software can be too.
              </h2>
              <p className="mt-4 text-slate-300">
                Off-the-shelf software can be useful, but it doesn&apos;t always match the way your
                business operates — unique approvals, specialized workflows, custom reports or
                systems that need to talk to each other.
              </p>
              <p className="mt-3 font-medium text-teal-100">
                We turn your business requirements into software that your team can actually use.
              </p>
              <Link
                href="/contact"
                className="btn-primary mt-8 inline-flex rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(45,212,191,0.3)]"
              >
                Build my application →
              </Link>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="glass-dark rounded-3xl p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Your business
                </p>
                <ol className="mt-5 space-y-3">
                  {businessFlow.map((item, i) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-200">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">{item}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 border-t border-white/10 pt-5 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">↓ LoopC ↓</p>
                  <p className="mt-2 font-display text-lg font-bold text-teal-200">
                    One connected system
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7fb]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <FadeIn className="text-center">
            <h2 className="font-display mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Not sure whether you need ERP or custom software?
            </h2>
            <div className="mx-auto mt-10 max-w-2xl">
              <PathForkArt className="h-auto w-full" />
            </div>
          </FadeIn>

          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Path one</p>
              <h3 className="font-display mt-2 text-2xl font-bold text-slate-900">
                Choose LoopC ERP
              </h3>
              <p className="mt-2 text-sm text-slate-500">When you need:</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {customVsErp.erp.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 text-teal-600" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/erp"
                className="mt-7 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Explore ERP →
              </Link>
            </FadeIn>
            <FadeIn delay={0.08}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Path two</p>
              <h3 className="font-display mt-2 text-2xl font-bold text-slate-900">
                Choose custom development
              </h3>
              <p className="mt-2 text-sm text-slate-500">When you need:</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {customVsErp.custom.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 text-teal-600" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-7 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Discuss custom →
              </Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.12} className="mt-12 text-center">
            <p className="text-sm font-semibold text-slate-800">
              And if your business needs both, we can connect them.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <p className="max-w-2xl text-lg text-slate-600">
            Two paths: buy and customize <strong className="text-slate-900">LoopC ERP</strong>, or
            commission a <strong className="text-slate-900">custom build</strong> for web, mobile,
            or internal systems. We handle design, development, testing, deployment and support.
          </p>
        </FadeIn>

        <div className="mt-14 space-y-10">
          {serviceTracks.map((track, i) => (
            <FadeIn key={track.id} delay={0.05 * i}>
              <article id={track.id} className="lift-card glass-panel scroll-mt-24 rounded-3xl p-8 sm:p-10">
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
                {track.id === "erp" ? (
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
              <h2 className="font-display text-xl font-bold text-slate-900">
                Not sure web, mobile, or ERP?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Tell us the problem — we&apos;ll recommend the right track without overselling.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-primary inline-flex shrink-0 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25"
            >
              Start a project
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
