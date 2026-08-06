import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { HomeHero } from "@/components/home-hero";
import { InteractiveTiltCard } from "@/components/interactive-tilt-card";
import { ScrollRevealWords } from "@/components/scroll-reveal-text";
import { TestimonialSlider } from "@/components/testimonial-slider";
import {
  getSoftwareApplicationSchema,
  homePageDescription,
  homePageTitle,
  seoKeywords,
} from "@/lib/seo";
import {
  caseStudies,
  problemCards,
  processSteps,
  serviceOffers,
} from "@/lib/positioning";
import { testimonials } from "@/lib/testimonials";
import { JsonLd } from "@/components/json-ld";

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
  const flagship = caseStudies[0];

  return (
    <div>
      <JsonLd data={getSoftwareApplicationSchema()} />
      <HomeHero />

      {/* Problem framing */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          <ScrollRevealWords text="Sound familiar?" staggerMs={40} />
        </h2>
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-3">
          {problemCards.map((card) => (
            <StaggerItem key={card.title}>
              <InteractiveTiltCard className="h-full">
                <div className="glass-panel group relative h-full overflow-hidden rounded-2xl border border-teal-100/60 bg-gradient-to-br from-white to-teal-50/30 p-7 shadow-md transition duration-500 ease-out hover:border-teal-200/80 hover:shadow-2xl">
                  <span className="inline-block h-1.5 w-12 rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-violet-400" />
                  <h3 className="font-display mt-5 text-lg font-bold text-slate-900">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
                </div>
              </InteractiveTiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* What we do — 4 offers */}
      <section className="border-y border-slate-200/80 bg-gradient-to-b from-teal-50/40 via-white to-violet-50/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">What we do</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Four ways we help — pick the track that fits
            </h2>
          </FadeIn>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceOffers.map((offer) => (
              <StaggerItem key={offer.slug}>
                <Link
                  href={offer.href}
                  className="glass-panel group flex h-full flex-col rounded-2xl border border-teal-100/50 p-6 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
                >
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-teal-800">
                    {offer.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{offer.summary}</p>
                  <p className="mt-4 text-xs text-slate-500">{offer.buyer}</p>
                  <span className="mt-4 text-xs font-semibold text-teal-700">Learn more →</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Proof — case study strip */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Proof</p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            We don&apos;t just consult — we build and run software ourselves
          </h2>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-10">
          <article className="glass-panel overflow-hidden rounded-3xl border border-teal-100/60 lg:flex">
            <div className="flex flex-1 flex-col justify-center p-8 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                {flagship.sector}
              </span>
              <h3 className="font-display mt-2 text-2xl font-bold text-slate-900">{flagship.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{flagship.outcome}</p>
              {flagship.metrics ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {flagship.metrics.map((m) => (
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
                href={`/work/${flagship.slug}`}
                className="mt-6 inline-flex w-fit text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Read the case study →
              </Link>
            </div>
            <div className="border-t border-teal-100/60 bg-gradient-to-br from-slate-900 to-teal-900 p-8 text-white lg:w-72 lg:border-t-0 lg:border-l">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-300">Built with</p>
              <ul className="mt-4 space-y-2 text-sm text-teal-100/90">
                {flagship.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </article>
        </FadeIn>
        <FadeIn className="mt-8">
          <Link href="/work" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
            View all work →
          </Link>
        </FadeIn>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200/80 bg-slate-50/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <FadeIn>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
              How we work
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              Discover → Design → Build → Deploy → Support. No black boxes.
            </p>
          </FadeIn>
          <ol className="mt-12 grid gap-6 sm:grid-cols-5">
            {processSteps.map((step, i) => (
              <FadeIn key={step.step} delay={0.05 * i}>
                <li className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="font-display mt-4 text-lg font-bold text-slate-900">{step.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden border-y border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">Testimonials</p>
          </FadeIn>
          <h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <ScrollRevealWords text="Results our clients talk about" staggerMs={32} />
          </h2>
          <div className="mt-12">
            <TestimonialSlider items={testimonials} />
          </div>
        </div>
      </section>

      {/* ERP plans teaser */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">LoopC ERP</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Transparent plans — not “contact us for pricing” on everything
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Basic, Standard, Premium, or a fully custom build. SaaS-style tiers for teams who want
            a product, not a six-month quote cycle.
          </p>
          <Link
            href="/erp/pricing"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-105"
          >
            View ERP plans →
          </Link>
        </FadeIn>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900 px-6 py-14 text-center shadow-2xl sm:px-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.2),transparent_55%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Tell us the problem. We&apos;ll tell you if code is the answer — and build it if it is.
              </h2>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/free-demo"
                  className="interactive-shine inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-teal-50"
                >
                  Book a free demo
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
