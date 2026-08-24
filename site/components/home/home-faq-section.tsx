"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import type { ErpFaqItem } from "@/lib/erp-api";

export function HomeFaqSection({ faqs }: { faqs: ErpFaqItem[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs.length) return null;

  return (
    <section className="section-light py-20 sm:py-24">
      <Container className="max-w-3xl">
        <FadeIn>
          <p className="type-label text-[var(--primary)]">FAQ</p>
          <h2 className="type-h2 mt-3 font-bold text-[var(--text)]">Questions we hear often</h2>
        </FadeIn>
        <ul className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = open === item.id;
            return (
              <FadeIn key={item.id} delay={index * 0.04}>
                <li className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:border-blue-200/70 hover:shadow-md hover:shadow-blue-500/5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80"
                    onClick={() => setOpen(isOpen ? null : item.id)}
                  >
                    <span className="font-semibold text-[var(--text)]">{item.question}</span>
                    <span
                      className={`text-[var(--primary)] transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-[var(--muted)]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </li>
              </FadeIn>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
