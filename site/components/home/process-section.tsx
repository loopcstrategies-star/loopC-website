"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { deliveryProcess } from "@/lib/process";

export function ProcessSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-process-step]"));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number(visible.target.getAttribute("data-process-step"));
        if (!Number.isNaN(index)) setActive(index);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.2, 0.5, 0.8] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const progress =
    deliveryProcess.length <= 1 ? 100 : (active / (deliveryProcess.length - 1)) * 100;

  return (
    <section className="section-dark on-dark relative overflow-hidden bg-[var(--dark)] py-20 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="grain-overlay" />
      <Container className="relative">
        <FadeIn>
          <p className="type-label text-blue-300">Our process</p>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold text-white">One team. From idea to launch.</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Strategy through support, without handing you between vendors.
          </p>
        </FadeIn>

        <div className="relative mt-14 max-w-3xl">
          {/* Spine track */}
          <div
            className="absolute bottom-3 left-[19px] top-3 w-px bg-white/10 sm:left-[23px]"
            aria-hidden
          />
          {/* Spine progress fill */}
          <div
            className="absolute left-[19px] top-3 w-px origin-top bg-gradient-to-b from-blue-500 via-violet-500 to-cyan-400 transition-[height] duration-500 ease-out sm:left-[23px]"
            style={{ height: `calc(${progress}% - 0.75rem)` }}
            aria-hidden
          />

          <ol className="relative space-y-0">
            {deliveryProcess.map((step, index) => {
              const isActive = active === index;
              const isPast = index < active;

              return (
                <li key={step.id} data-process-step={index}>
                  <FadeIn delay={index * 0.05}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className="group relative flex w-full gap-5 py-5 text-left sm:gap-7 sm:py-6"
                    >
                      <span
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold tracking-wide transition duration-300 sm:h-12 sm:w-12 sm:text-sm ${
                          isActive
                            ? "border-blue-400 bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20"
                            : isPast
                              ? "border-blue-400/60 bg-blue-500/20 text-blue-200"
                              : "border-white/20 bg-[#0b1224] text-slate-400 group-hover:border-white/35 group-hover:text-slate-200"
                        }`}
                      >
                        {step.num}
                      </span>

                      <span className="min-w-0 flex-1 pt-0.5 sm:pt-1">
                        <span
                          className={`block font-semibold transition-colors duration-200 sm:text-lg ${
                            isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="mt-1 block text-sm text-slate-400">{step.summary}</span>
                        <span
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                            isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <span className="overflow-hidden">
                            <span className="mt-3 block text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                              {step.detail}
                            </span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </FadeIn>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
