import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { HomeHero } from "@/components/home-hero";
import { JsonLd } from "@/components/json-ld";
import { ProcessTimeline } from "@/components/process-timeline";
import {
  CapabilityHubVisual,
  LoopcEcosystemDiagram,
} from "@/components/ecosystem-visuals";
import { PossibilityMark, WhyMark } from "@/components/section-illustrations";
import { TestimonialSlider } from "@/components/testimonial-slider";
import {
  faqs,
  journeySteps,
  possibilities,
  whyDetailed,
} from "@/lib/home-content";
import {
  getSoftwareApplicationSchema,
  homePageDescription,
  homePageTitle,
  seoKeywords,
} from "@/lib/seo";
import { testimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: homePageTitle,
  description: homePageDescription,
  keywords: [...seoKeywords],
  openGraph: {
    title: homePageTitle,
    description: homePageDescription,
    url: "/",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return (
    <div className="bg-[#f4f7fb]">
      <JsonLd data={getSoftwareApplicationSchema()} />
      <HomeHero />

      {/* One partner */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            One technology partner
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            From business idea to working product.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Building software is more than writing code. It starts with understanding your
            business, your customers, your processes and the problems you want to solve.
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            At LoopC, we turn those requirements into practical digital products — understanding
            the requirement, designing the experience, developing the application, testing the
            system and preparing it for launch.
          </p>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-10">
          <ol className="flex flex-wrap items-center gap-2">
            {journeySteps.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-800">
                  {step}
                </span>
                {i < journeySteps.length - 1 ? (
                  <span className="text-teal-500" aria-hidden>
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm font-semibold text-slate-800">
            One team. One process. One accountable technology partner.
          </p>
        </FadeIn>
      </section>

      {/* How we build — premium SaaS process */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#050b16] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_20%_40%,rgba(20,184,166,0.14),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_85%_20%,rgba(167,139,250,0.1),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_30%_at_70%_90%,rgba(56,189,248,0.08),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <ProcessTimeline />
        </div>
      </section>

      {/* Possibilities — ecosystem diagram + editorial list */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
            <FadeIn className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                Possibilities
              </p>
              <h2 className="font-display mt-3 max-w-md text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                If your business needs it, we can build it.
              </h2>
              <div className="mt-8">
                <LoopcEcosystemDiagram />
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <ul className="divide-y divide-slate-200">
                {possibilities.map((item, i) => {
                  const accents = [
                    "#a78bfa",
                    "#60a5fa",
                    "#2dd4bf",
                    "#fb923c",
                    "#38bdf8",
                    "#c084fc",
                  ];
                  return (
                    <li
                      key={item.title}
                      className="poss-list-item flex gap-4 rounded-xl py-6 first:pt-0 last:pb-0"
                      style={{ ["--poss-accent" as string]: accents[i % accents.length] }}
                    >
                      <span className="poss-icon mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-teal-700">
                        <PossibilityMark title={item.title} />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why LoopC — trust points + laptop/mobile capability hub */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#050b16]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(167,139,250,0.1),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_15%_80%,rgba(20,184,166,0.12),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
            <div>
              <FadeIn>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  More than a software vendor.
                </h2>
                <p className="mt-3 max-w-xl text-slate-300">
                  A technology partner that understands the business behind the application.
                </p>
              </FadeIn>
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {whyDetailed.map((item, i) => {
                  const accents = [
                    "#a78bfa",
                    "#60a5fa",
                    "#2dd4bf",
                    "#fb923c",
                    "#38bdf8",
                    "#f472b6",
                  ];
                  return (
                    <StaggerItem key={item.title}>
                      <article
                        className="why-hover-card flex h-full gap-3 rounded-2xl p-4"
                        style={{
                          ["--why-accent" as string]: accents[i % accents.length],
                          background: "rgba(15,23,42,0.65)",
                          borderColor: "rgba(255,255,255,0.08)",
                        }}
                      >
                        <span className="why-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-teal-300">
                          <WhyMark index={i} />
                        </span>
                        <div>
                          <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-400">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
            <FadeIn delay={0.1}>
              <CapabilityHubVisual />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Brand line */}
      <section className="border-y border-slate-200/80 bg-teal-50/40">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <FadeIn>
            <p className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
              You bring the business. We build the technology.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              From custom web and mobile applications to complete ERP systems, LoopC helps
              businesses turn ideas, processes and challenges into reliable digital products.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials — quote on dark, no panels */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#050b16] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_20%,rgba(20,184,166,0.14),transparent)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
              Testimonials
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Trusted by businesses that build with LoopC
            </h2>
            <p className="mt-3 max-w-xl text-slate-300">
              Real outcomes from custom software, mobile apps and LoopC ERP engagements.
            </p>
          </FadeIn>
          <div className="mt-12">
            <TestimonialSlider items={testimonials} variant="dark" />
          </div>
          <FadeIn className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="primary-btn inline-flex rounded-full border border-teal-400/40 bg-teal-500/15 px-6 py-3 text-sm font-semibold text-teal-100"
            >
              View selected work →
            </Link>
            <Link
              href="/erp"
              className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-teal-400/40"
            >
              Explore LoopC ERP →
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
        </FadeIn>
        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq, i) => (
            <FadeIn key={faq.q} delay={0.04 * i}>
              <details className="group py-5">
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {faq.q}
                    <span className="text-teal-600 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Final CTA — hero echo graphic */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-[#050b16] px-6 py-14 shadow-2xl sm:px-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.18),transparent_55%)]" />
            <div className="relative text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
                Ready to build?
              </p>
              <h2 className="font-display mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Tell us what you&apos;re trying to build.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300">
                Whether you need a new application, want to replace manual processes, or are looking
                for an ERP to manage your business — let&apos;s discuss what you need.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="btn-primary interactive-shine inline-flex rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(45,212,191,0.35)]"
                >
                  Start a project
                </Link>
                <Link
                  href="/free-demo"
                  className="btn-secondary inline-flex rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white"
                >
                  Book an ERP demo
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-400">
                Tell us your idea. We&apos;ll help you turn it into a plan.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
