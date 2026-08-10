import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { qualityPillars, whatWeDoCards } from "@/lib/home-content";
import { techStack } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "LoopC builds technology with a business mindset — custom web, mobile, ERP platforms and long-term support.",
  openGraph: {
    title: `About | ${siteConfig.brand}`,
    description: "We build digital systems for businesses — from idea to launch.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div>
      <PageBanner
        banner="about"
        eyebrow="About LoopC"
        title="We build technology with a business mindset"
        description="From custom applications to complete ERP platforms — business understanding, product design and software engineering built for the real world."
        priority
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/work"
            className="btn-primary interactive-shine inline-flex rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            See our work
          </Link>
          <Link
            href="/contact"
            className="btn-secondary inline-flex rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md"
          >
            Start a project
          </Link>
        </div>
      </PageBanner>

      <section className="relative overflow-hidden border-y border-white/5 bg-[#050b16]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(20,184,166,0.12),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">What we do</p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Technology built around your business.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Every business has different customers, workflows and operational challenges. Instead
              of forcing your business into a standard solution, we build technology around your
              requirements.
            </p>
          </FadeIn>
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {whatWeDoCards.map((card) => (
              <StaggerItem key={card.id}>
                <article className="service-card glass-dark flex h-full flex-col rounded-3xl p-6">
                  <span className="card-icon mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-lg text-teal-300">
                    ◉
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">{card.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{card.summary}</p>
                  <Link
                    href={card.href}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-300"
                  >
                    Learn more <span className="card-arrow">→</span>
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#050b16] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">Quality first</p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              We don&apos;t just build it. We make sure it works.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              A successful application isn&apos;t just about how it looks. It needs to be reliable,
              usable and ready for real users.
            </p>
          </FadeIn>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qualityPillars.map((q) => (
              <StaggerItem key={q.title}>
                <article className="glass-dark h-full rounded-2xl p-5">
                  <h3 className="font-display text-lg font-bold text-teal-200">{q.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{q.description}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn className="space-y-6 text-lg leading-relaxed text-slate-600">
          <p>
            {siteConfig.name} helps businesses turn ideas, processes and challenges into practical
            digital systems. We are a <strong className="text-slate-900">software product + custom
            application company</strong> — not only an ERP reseller, and not a slide-deck agency.
          </p>
          <p>
            Two revenue streams, one partner:{" "}
            <strong className="text-slate-900">custom software</strong> (web, mobile, internal tools)
            and <strong className="text-slate-900">LoopC ERP</strong> (plans you can buy and
            customize). Clients either use our product or ask us to build something unique — often
            both over time.
          </p>
          <p>
            Our philosophy is business-first: if a process change solves the problem, we&apos;ll say
            so. When software is the answer, we take you from discover → design → develop → test →
            deploy → support — so you get a working product, not just code.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Technology we ship on
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {techStack.map((t) => (
              <li
                key={t.name}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
              >
                {t.name}
                <span className="ml-2 text-xs font-normal text-slate-500">{t.category}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.14} className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            View services
          </Link>
          <Link
            href="/erp"
            className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            LoopC ERP
          </Link>
          <Link
            href="/contact"
            className="btn-primary inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25"
          >
            Talk to us
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
