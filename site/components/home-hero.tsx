"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/components/fade-in";
import { HeroBannerVideo } from "@/components/hero-banner-video";
import { ScrollRevealWords } from "@/components/scroll-reveal-text";

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 48]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[min(92vh,820px)] overflow-hidden border-b border-slate-800/40"
    >
      <HeroBannerVideo staticOnly={!!reduce} />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_70%_60%_at_20%_50%,rgba(13,148,136,0.18),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-[min(92vh,820px)] max-w-6xl items-center px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <motion.div className="max-w-2xl" style={{ y: contentY }}>
          <FadeIn onMount>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/35 bg-teal-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-teal-200 shadow-sm backdrop-blur-md">
              Business strategy → software that runs it
            </p>
          </FadeIn>
          <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-[1.1]">
            <span className="block">
              <ScrollRevealWords
                className="font-display text-white"
                text="We understand your business first. Then we build the software for it."
                staggerMs={28}
                animateOnMount
              />
            </span>
          </h1>
          <FadeIn onMount delay={0.08} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            <p>
              Web platforms, mobile apps, and our own ERP — designed around how your business
              actually works, not a generic template.
            </p>
          </FadeIn>
          <FadeIn onMount delay={0.12} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/free-demo"
              className="interactive-shine relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/40 transition hover:shadow-xl"
            >
              Get a free demo
            </Link>
            <Link
              href="/erp"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white shadow-md backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
            >
              Explore LoopC ERP
            </Link>
          </FadeIn>
        </motion.div>
      </div>
    </section>
  );
}
