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
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.5, 0.8] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const current = deliveryProcess[active] ?? deliveryProcess[0];

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

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <ol className="space-y-3">
            {deliveryProcess.map((step, index) => (
              <li key={step.id} data-process-step={index}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    active === index
                      ? "border-blue-400/40 bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/8"
                  }`}
                >
                  <p className="text-xs font-semibold tracking-[0.16em] text-blue-300">{step.num}</p>
                  <p className="mt-1 font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{step.summary}</p>
                </button>
              </li>
            ))}
          </ol>

          <div className="lg:sticky lg:top-24">
            <div className="glass-dark rounded-3xl p-6 sm:p-8">
              <p className="type-label text-blue-300">{current.num}</p>
              <h3 className="type-h3 mt-3 font-semibold text-white">{current.title}</h3>
              <p className="mt-4 leading-relaxed text-slate-300">{current.detail}</p>
              <div className="mt-8 grid grid-cols-7 gap-1">
                {deliveryProcess.map((step, index) => (
                  <div
                    key={step.id}
                    className={`h-1.5 rounded-full ${
                      index <= active
                        ? "bg-gradient-to-r from-blue-500 to-violet-500"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
