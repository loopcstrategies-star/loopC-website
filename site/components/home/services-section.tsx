import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Container, SectionLabel } from "@/components/ui/container";
import { services } from "@/lib/services";

const motifs: Record<string, string> = {
  phone: "M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v2h8V5H8z",
  browser: "M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2 0h12v3H6V6z",
  app: "M4 5h7v7H4V5zm9 0h7v4h-7V5zM4 14h7v5H4v-5zm9 6V11h7v9h-7z",
  chart: "M4 19V9m5 10V5m5 14v-7m5 7V8",
  workflow: "M5 7h6m-3-3v6m8 4h6m-3-3v6M5 17h6",
  pencil: "M4 20h4L19 9l-4-4L4 16v4z",
  gears: "M12 8a4 4 0 100 8 4 4 0 000-8zm8 4h-2M6 12H4m12.5-6.5l-1.5 1.5M7 17.5L5.5 19M17.5 17.5L19 19M7 6.5L5.5 5",
  plug: "M8 7V3m8 4V3M7 7h10v5a5 5 0 01-10 0V7zm5 5v6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
};

export function ServicesSection() {
  return (
    <section className="bg-[#f4f6fa] py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionLabel>01 — What we build</SectionLabel>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold text-slate-950">
            Software for the way the business already works.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Nine capabilities, one team. Each engagement starts with the workflow — then the
            website, app, dashboard or system that should exist.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeIn key={service.slug} delay={index * 0.04}>
              <Link
                href={service.href}
                className="lift-card group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d={motifs[service.motif]}
                      />
                    </svg>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="type-h3 mt-4 font-semibold text-slate-950">{service.shortTitle}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.summary}</p>
                <span className="mt-4 text-sm font-semibold text-teal-700 group-hover:underline">
                  Explore {service.shortTitle}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
