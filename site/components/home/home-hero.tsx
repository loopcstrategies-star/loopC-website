"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { fadeUp, staggerChildren } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { HeroVisualImage } from "@/components/home/hero-visual-image";
import { Container } from "@/components/ui/container";
import { getCustomSoftwareCta, getExploreErpCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

const defaultPills = ["Web apps", "Mobile apps", "SaaS", "ERP", "Dashboards", "APIs"];

const PARTICLES = [
  { top: "18%", left: "12%", dur: "11s", delay: "0s" },
  { top: "32%", left: "78%", dur: "13s", delay: "1.2s" },
  { top: "55%", left: "22%", dur: "10s", delay: "0.6s" },
  { top: "68%", left: "65%", dur: "12s", delay: "2s" },
  { top: "42%", left: "48%", dur: "14s", delay: "0.3s" },
  { top: "75%", left: "38%", dur: "11s", delay: "1.8s" },
  { top: "25%", left: "55%", dur: "9s", delay: "0.9s" },
  { top: "60%", left: "88%", dur: "13s", delay: "2.4s" },
];

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
    return <span className="text-white">{title}</span>;
  }
  return (
    <>
      {parts.map((part, i) =>
        /operate smarter/i.test(part) ? (
          <span key={i} className="text-gradient">
            {part}
          </span>
        ) : (
          <span key={i} className="text-white">
            {part}
          </span>
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

  const LeftColumn = reduce ? "div" : motion.div;
  const leftColumnProps = reduce
    ? {}
    : {
        initial: "hidden" as const,
        animate: "show" as const,
        variants: staggerChildren,
      };

  const Item = reduce ? "div" : motion.div;
  const itemProps = reduce ? {} : { variants: fadeUp };

  return (
    <section className="section-dark on-dark relative overflow-hidden bg-[var(--dark)] text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="hero-mesh pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="hero-glow-drift pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl"
        style={{ transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px)` }}
      />
      <div
        className="hero-glow-drift pointer-events-none absolute -right-10 top-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-500/25 blur-3xl"
        style={{ transform: `translate(${offset.x * -0.3}px, ${offset.y * -0.3}px)` }}
      />
      <div
        className={`pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl ${reduce ? "" : "hero-glow-pulse"}`}
        style={{ transform: `translate(${offset.x * 0.2}px, ${offset.y * 0.2}px)` }}
      />
      <div
        className={`pointer-events-none absolute right-[4%] top-1/2 hidden h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-blue-600/25 via-violet-600/18 to-cyan-500/12 blur-3xl lg:block ${reduce ? "" : "hero-glow-pulse"}`}
        style={{
          transform: `translate(calc(${offset.x * -0.15}px), calc(-50% + ${offset.y * 0.15}px))`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="hero-particle"
            style={
              {
                top: p.top,
                left: p.left,
                "--particle-dur": p.dur,
                "--particle-delay": p.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="grain-overlay" />

      <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-28">
        <LeftColumn {...leftColumnProps} className="relative z-10">
          <Item {...itemProps}>
            <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-200 shadow-sm shadow-blue-500/10">
              {siteConfig.positioning.eyebrow}
            </p>
          </Item>
          <Item {...itemProps}>
            <h1 className="type-display mt-6 font-extrabold text-white">
              <HeroTitle title={title} />
            </h1>
          </Item>
          <Item {...itemProps}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {subtitle}
            </p>
          </Item>
          <Item {...itemProps}>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href={ctaHref}>{ctaLabel}</MagneticButton>
              <MagneticButton href={secondaryCtaHref} variant="dark">
                {secondaryCtaLabel}
              </MagneticButton>
            </div>
          </Item>
          <Item {...itemProps}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {pills.map((pill) => (
                <li
                  key={pill}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition duration-200 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white"
                >
                  {pill}
                </li>
              ))}
            </ul>
          </Item>
        </LeftColumn>
        <div className="relative z-10 lg:scale-[1.02] lg:pl-2">
          <HeroVisualImage />
        </div>
      </Container>
      <div className="page-hero-accent opacity-80" aria-hidden />
    </section>
  );
}
