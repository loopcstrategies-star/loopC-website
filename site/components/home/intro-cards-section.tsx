"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";

const cards = [
  {
    id: "discover",
    label: "01",
    title: "Discover",
    description: "Understand business goals and requirements.",
    accent: "from-blue-500 to-cyan-400",
    iconBg: "bg-blue-50 text-blue-600",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "design",
    label: "02",
    title: "Design",
    description: "Create intuitive user experiences and scalable product architecture.",
    accent: "from-violet-500 to-pink-400",
    iconBg: "bg-violet-50 text-violet-600",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    id: "build",
    label: "03",
    title: "Build",
    description: "Develop reliable, high-performance digital products.",
    accent: "from-teal-500 to-cyan-400",
    iconBg: "bg-blue-50 text-[var(--primary)]",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
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
          <p className="type-label text-[var(--primary)]">What we do</p>
          <h2 className="type-h2 mt-3 font-bold text-[var(--text)]">
            Technology That Turns Ideas Into Products
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            From discovery to launch, we partner with businesses to design and ship software that
            fits how they actually work.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="premium-card group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300/60 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${card.accent} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30`}
              />
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
              >
                {card.icon}
              </div>
              <p className="mt-4 text-xs font-bold tracking-widest text-[var(--primary)]">{card.label}</p>
              <h3 className="mt-1 text-xl font-bold text-[var(--text)]">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">{card.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--primary)] transition-all duration-300 group-hover:translate-x-1 max-lg:opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                Learn more
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
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
