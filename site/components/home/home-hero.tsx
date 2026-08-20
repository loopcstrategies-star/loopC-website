"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container } from "@/components/ui/container";
import { HeroStage } from "@/components/home/hero-stage";
import { getCustomSoftwareCta, getExploreErpCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

const defaultPills = ["ERP", "Web apps", "Mobile apps", "Dashboards", "Custom software"];

export type HomeHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  pills?: string[];
};

export function HomeHero({
  title = siteConfig.tagline,
  subtitle = siteConfig.supportingLine,
  ctaLabel = getExploreErpCta().label,
  ctaHref = getExploreErpCta().href,
  secondaryCtaLabel = getCustomSoftwareCta().label,
  secondaryCtaHref = getCustomSoftwareCta().href,
  pills = defaultPills,
}: HomeHeroProps) {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMove(event: MouseEvent) {
      const x = (event.clientX / window.innerWidth - 0.5) * 16;
      const y = (event.clientY / window.innerHeight - 0.5) * 12;
      setOffset({ x, y });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <section className="relative overflow-hidden bg-[#050b16] text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div
        className="hero-glow-drift pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl"
        style={{ transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px)` }}
      />
      <div
        className="hero-glow-drift pointer-events-none absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl"
        style={{ transform: `translate(${offset.x * -0.3}px, ${offset.y * -0.3}px)` }}
      />
      <div className="grain-overlay" />

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-teal-200">
            {siteConfig.positioning.eyebrow}
          </p>
          <h1 className="type-display mt-6 font-bold text-white">{title}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {subtitle}
          </p>
          <p className="mt-4 max-w-xl text-sm text-slate-400">{siteConfig.positioning.heroSupport}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href={ctaHref}>{ctaLabel}</MagneticButton>
            <MagneticButton href={secondaryCtaHref} variant="secondary">
              {secondaryCtaLabel}
            </MagneticButton>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative min-h-[24rem] sm:min-h-[26rem] lg:min-h-[22rem]"
          style={{
            transform: reduce ? undefined : `translate3d(${offset.x * 0.35}px, ${offset.y * 0.35}px, 0)`,
          }}
        >
          <HeroStage />
        </div>
      </Container>
    </section>
  );
}
