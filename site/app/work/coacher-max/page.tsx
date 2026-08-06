import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { caseStudies } from "@/lib/positioning";
import { siteConfig } from "@/lib/site-config";

const study = caseStudies.find((c) => c.slug === "coacher-max")!;

export const metadata: Metadata = {
  title: "Coacher Max — Case Study",
  description:
    "How LoopC built Coacher Max — a live multi-tenant SaaS platform for tuition centers with Flutter, NestJS, and PostgreSQL.",
  openGraph: {
    title: `Coacher Max | ${siteConfig.brand}`,
    description: study.outcome,
    url: "/work/coacher-max",
  },
};

const sections = [
  {
    title: "Problem",
    body: study.problem,
  },
  {
    title: "Approach",
    body: "We mapped center workflows end-to-end — enrollment, attendance, fee cycles, parent communication, and staff roles — then designed a multi-tenant architecture so each center runs isolated data with shared platform upgrades. Flutter for parent and staff mobile apps, NestJS API, PostgreSQL, and a Next.js admin dashboard for center owners.",
  },
  {
    title: "What we built",
    body: "Mobile app (iOS/Android) for parents and teachers, admin dashboard for center management, payment integration, role-based access, announcements and chat, scheduling/timetable, attendance tracking, and reporting — all live in production, not a prototype.",
  },
  {
    title: "Result",
    body: "Centers replaced spreadsheet-and-WhatsApp operations with one system. Fee-collection follow-ups dropped, attendance became auditable, and owners got branch-level visibility without calling every teacher. LoopC owns the product roadmap — proof that we build and run software, not just consult on it.",
  },
];

export default function CoacherMaxCaseStudyPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-60" />
      <article className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <Link href="/work" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
            ← All work
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            {study.sector}
          </p>
          <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {study.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{study.outcome}</p>
        </FadeIn>

        <div className="mt-12 space-y-10">
          {sections.map((section, i) => (
            <FadeIn key={section.title} delay={0.06 * i}>
              <section>
                <h2 className="font-display text-xl font-bold text-slate-900">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{section.body}</p>
              </section>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.24} className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Technology</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {study.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700"
              >
                {t}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.28} className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/free-demo"
            className="inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 hover:brightness-105"
          >
            Build something like this
          </Link>
          <Link
            href="/erp"
            className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Explore LoopC ERP
          </Link>
        </FadeIn>
      </article>
    </div>
  );
}
