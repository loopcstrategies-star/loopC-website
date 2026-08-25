import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import {
  type ErpWebsitePage,
  erpFetch,
  sectionByKey,
} from "@/lib/erp-api";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";
import { deliveryProcess } from "@/lib/process";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.about.title,
  description: pageSeo.about.description,
  path: "/about",
});

const defaultValues = [
  {
    title: "Business First",
    copy: "We start with the workflow, the constraint and the user — not the technology trend.",
    icon: "◈",
  },
  {
    title: "Simplicity",
    copy: "Software should feel obvious to the people who use it every day.",
    icon: "◇",
  },
  {
    title: "Quality",
    copy: "We build to last — not to demo. Every product is crafted with attention to detail and reliability.",
    icon: "◆",
  },
  {
    title: "Innovation",
    copy: "We stay current so your business can benefit from the best tools and approaches available.",
    icon: "◉",
  },
  {
    title: "Partnership",
    copy: "Launch is a delivery step. We stay on for support, improvements and the next release.",
    icon: "◎",
  },
] as const;

type PagePayload = { page: ErpWebsitePage };

function storyParagraphs(body: string | null | undefined, fallback: string[]): string[] {
  if (!body?.trim()) return fallback;
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function AboutPage() {
  const data = await erpFetch<PagePayload>("/api/public/pages/about");
  const hero = sectionByKey(data?.page?.sections, "hero");
  const story = sectionByKey(data?.page?.sections, "story");

  const heroTitle =
    hero?.title || "We Build Technology Around the Way Businesses Work.";
  const heroDescription =
    hero?.subtitle ||
    hero?.body ||
    "We are a technology team focused on creating practical, scalable and user-friendly digital products that help businesses operate better.";
  const storyTitle = story?.title || "From Business Problems to Digital Solutions";
  const storyCopy = storyParagraphs(story?.body, [
    "Businesses often operate across spreadsheets, disconnected tools, manual processes and multiple systems. We believe technology should simplify that complexity.",
    "Our approach is simple: understand the problem, design the right experience, build reliable technology and continue improving it as the business grows.",
    "From a single ERP implementation to a complex custom platform, every engagement starts the same way — with a genuine understanding of how the work gets done today and what better would look like tomorrow.",
  ]);

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        eyebrow="About LoopC"
        title={heroTitle}
        description={heroDescription}
        dark
        backgroundImage="/images/page-heroes/about.jpg"
      />

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <p className="type-label text-[var(--primary)]">Our story</p>
            <h2 className="type-h2 mt-3 font-bold text-slate-950">{storyTitle}</h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="space-y-5 text-slate-600 leading-relaxed">
              {storyCopy.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="section-light py-20 sm:py-24">
        <Container>
          <FadeIn>
            <p className="type-label text-[var(--primary)]">Our approach</p>
            <h2 className="type-h2 mt-3 max-w-xl font-bold text-slate-950">
              How we work with you
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              A clear process from the first conversation to long-term support.
            </p>
          </FadeIn>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deliveryProcess.map((step, i) => (
              <FadeIn key={step.id} delay={i * 0.06}>
                <li className="group flex flex-col rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/70 hover:shadow-md">
                  <p className="text-3xl font-bold text-[var(--primary)]">{step.num}</p>
                  <p className="mt-2 font-semibold text-slate-950">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.summary}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <FadeIn>
            <p className="type-label text-[var(--primary)]">What we stand for</p>
            <h2 className="type-h2 mt-3 max-w-xl font-bold text-slate-950">
              Principles that guide everything we build
            </h2>
          </FadeIn>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {defaultValues.map((value, i) => (
              <FadeIn key={value.title} delay={i * 0.07}>
                <li className="group flex flex-col rounded-2xl border border-slate-200/80 bg-[#f8faf9] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-md">
                  <span className="text-2xl text-[var(--primary)]" aria-hidden>
                    {value.icon}
                  </span>
                  <p className="mt-3 font-bold text-slate-950">{value.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.copy}</p>
                </li>
              </FadeIn>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-dark on-dark py-20 sm:py-24">
        <Container className="text-center">
          <FadeIn>
            <h2 className="type-h2 font-bold text-white">Ready to build something better?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Tell us about your business challenge. We will help you find the right next step.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="btn-primary inline-flex rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
              >
                Start a Project
              </Link>
              <Link
                href="/erp"
                className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
              >
                Explore ERP
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
