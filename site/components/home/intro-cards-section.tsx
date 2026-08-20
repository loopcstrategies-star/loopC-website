"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";

const cards = [
  {
    id: "understand",
    label: "01",
    title: "Understand",
    description:
      "We learn how your business works — the workflows, the teams, the data and the goals — before a single line of code is written.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "build",
    label: "02",
    title: "Build",
    description:
      "We design and develop modern digital products — web applications, mobile apps, ERP systems and custom software — built around your exact requirements.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    id: "grow",
    label: "03",
    title: "Grow",
    description:
      "We support your product after launch — monitoring, updates, new features and improvements — as your business scales and evolves.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

export function IntroCardsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="type-label text-teal-600">Our approach</p>
          <h2 className="type-h2 mt-3 font-bold text-slate-950">
            Technology Built Around Your Business
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Every business works differently. We create digital solutions around your workflows, your
            teams and your goals — helping you replace disconnected tools and manual processes with
            technology that works for your business.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-[#f8faf9] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-teal-300/60 hover:shadow-lg hover:shadow-teal-50"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-transform duration-200 group-hover:scale-110">
                {card.icon}
              </div>
              <p className="mt-4 text-xs font-bold tracking-widest text-teal-600">{card.label}</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{card.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Learn more
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
