"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { HeroProductVisual } from "@/components/home/hero-product-visual";
import { Container } from "@/components/ui/container";
import { getCustomSoftwareCta, getExploreErpCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

const defaultPills = ["Web apps", "Mobile apps", "SaaS", "ERP", "Dashboards", "APIs"];

export type HomeHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  pills?: string[];
};

function HeroTitle({ title }: { title: string }) {
  const parts = title.split(/(Operate Smarter)/i);
  if (parts.length === 1) {
    return <>{title}</>;
  }
  return (
    <>
      {parts.map((part, i) =>
        /operate smarter/i.test(part) ? (
          <span key={i} className="text-gradient">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function HomeHero({
  title = siteConfig.tagline,
  subtitle = siteConfig.supportingLine,
  ctaLabel = getCustomSoftwareCta().label,
  ctaHref = getCustomSoftwareCta().href,
  secondaryCtaLabel = getExploreErpCta().label,
  secondaryCtaHref = getExploreErpCta().href,
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
    <section className="relative overflow-hidden bg-[var(--dark)] text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div
        className="hero-glow-drift pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl"
        style={{ transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px)` }}
      />
      <div
        className="hero-glow-drift pointer-events-none absolute -right-10 top-1/3 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"
        style={{ transform: `translate(${offset.x * -0.3}px, ${offset.y * -0.3}px)` }}
      />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="grain-overlay" />

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-blue-200">
            {siteConfig.positioning.eyebrow}
          </p>
          <h1 className="type-display mt-6 font-extrabold text-white">
            <HeroTitle title={title} />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href={ctaHref}>{ctaLabel}</MagneticButton>
            <MagneticButton href={secondaryCtaHref} variant="dark">
              {secondaryCtaLabel}
            </MagneticButton>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <li
                key={pill}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>
        <HeroProductVisual />
      </Container>
    </section>
  );
}
