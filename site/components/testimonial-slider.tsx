"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

type Props = {
  items: Testimonial[];
  /** Dark glass style for navy sections */
  variant?: "light" | "dark";
};

export function TestimonialSlider({ items, variant = "light" }: Props) {
  const dark = variant === "dark";
  const [selected, setSelected] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: "trimSnaps" },
    [Autoplay({ delay: 6500, stopOnInteraction: true, stopOnMouseEnter: true })],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const id = requestAnimationFrame(() => onSelect());
    return () => {
      cancelAnimationFrame(id);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <div className="relative px-1">
      <div className="overflow-hidden pb-1" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {items.map((t, index) => (
            <div
              key={t.id}
              className="min-w-0 shrink-0 grow-0 px-2 sm:px-4"
              style={{ flex: "0 0 100%" }}
            >
              <motion.article
                initial={false}
                animate={{
                  opacity: selected === index ? 1 : 0.55,
                  y: selected === index ? 0 : 6,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex min-h-[240px] max-w-3xl flex-col items-center gap-6 py-4 text-center sm:min-h-[220px] sm:flex-row sm:items-center sm:gap-10 sm:text-left"
              >
                <div
                  className={`relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full sm:mx-0 sm:h-24 sm:w-24 ${
                    dark ? "ring-2 ring-teal-400/35" : "ring-2 ring-teal-500/25"
                  }`}
                >
                  <Image
                    src={t.imageSrc}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p
                    className={`mb-3 text-sm tracking-[0.2em] ${
                      dark ? "text-teal-300/80" : "text-teal-700/80"
                    }`}
                    aria-label="5 star rating"
                  >
                    ★★★★★
                  </p>
                  <blockquote
                    className={`font-display text-xl font-medium leading-relaxed sm:text-2xl ${
                      dark ? "text-slate-50" : "text-slate-800"
                    }`}
                  >
                    <span className="text-teal-400/90">&ldquo;</span>
                    {t.quote}
                    <span className="text-teal-400/90">&rdquo;</span>
                  </blockquote>
                  <footer className="mt-6">
                    <p className={`font-bold ${dark ? "text-white" : "text-slate-900"}`}>{t.name}</p>
                    <p className={`mt-0.5 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                      {t.role} · {t.company}
                    </p>
                  </footer>
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`slider-dot h-2 rounded-full transition-all ${
                selected === i
                  ? "w-8 bg-teal-400"
                  : dark
                    ? "w-2 bg-white/25 hover:bg-teal-400/50"
                    : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
              dark
                ? "border-white/15 bg-transparent text-white hover:border-teal-400/40"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-800"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
              dark
                ? "border-white/15 bg-transparent text-white hover:border-teal-400/40"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-800"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
