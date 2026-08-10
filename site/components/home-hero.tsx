"use client";

import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { HeroShowcase } from "@/components/hero-showcase";
import { companyStats, heroPills } from "@/lib/home-content";

function PillIcon({ icon }: { icon: string }) {
  const common = "h-5 w-5";
  if (icon === "web") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9S14.5 18.5 12 21c-2.5-2.5-3.75-5.5-3.75-9S9.5 5.5 12 3z" />
      </svg>
    );
  }
  if (icon === "mobile") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2zm3 15h.01" />
      </svg>
    );
  }
  if (icon === "erp") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 8l-3 4 3 4M16 8l3 4-3 4M11 6l2 12" />
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[#050b16]">
      <div
        className="hero-glow-drift pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_40%,rgba(20,184,166,0.18),transparent_55%),radial-gradient(ellipse_40%_35%_at_15%_25%,rgba(251,191,36,0.06),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(94,234,212,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:pb-10 lg:pt-16">
        <div>
          <FadeIn onMount>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-200 shadow-[0_0_24px_rgba(20,184,166,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
              LoopC · Software &amp; business systems
            </p>
          </FadeIn>

          <FadeIn onMount delay={0.06}>
            <h1 className="font-display mt-6 text-[2.35rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.15rem]">
              Your business has a way of working.{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                Your software
              </span>{" "}
              should too.
            </h1>
          </FadeIn>

          <FadeIn onMount delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              We design and build digital solutions that fit the way your business operates —
              from custom web applications and mobile apps to complete ERP platforms.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              From the first idea to development, testing, deployment and ongoing support, LoopC
              gives you one technology partner for the entire journey.
            </p>
          </FadeIn>

          <FadeIn onMount delay={0.14} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="primary-btn interactive-shine inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.35)]"
            >
              Start a project
              <span className="arrow inline-block" aria-hidden>
                →
              </span>
            </Link>
            <Link
              href="/erp"
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/40 text-[10px]">
                ▶
              </span>
              Explore LoopC ERP
            </Link>
          </FadeIn>

          <FadeIn onMount delay={0.18} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroPills.map((pill) => (
              <div
                key={pill.label}
                className="service-card-mini glass-dark flex flex-col items-start gap-2 rounded-2xl px-3.5 py-3.5"
              >
                <span className="card-icon text-teal-300">
                  <PillIcon icon={pill.icon} />
                </span>
                <span className="text-xs font-semibold text-slate-100">{pill.label}</span>
              </div>
            ))}
          </FadeIn>
        </div>

        <FadeIn onMount delay={0.12} className="lg:pl-2">
          <HeroShowcase />
        </FadeIn>
      </div>

      {/* Trust / stats bar */}
      <div className="relative border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
            {companyStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 border-t border-white/10 pt-4 lg:max-w-sm lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex -space-x-2">
              {["A", "R", "M"].map((letter) => (
                <span
                  key={letter}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-gradient-to-br from-teal-400 to-sky-500 text-xs font-bold text-slate-950"
                >
                  {letter}
                </span>
              ))}
            </div>
            <div>
              <p className="text-amber-300" aria-label="5 star rating">
                ★★★★★
              </p>
              <p className="text-xs leading-snug text-slate-400">
                Professional, reliable and business-focused.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
