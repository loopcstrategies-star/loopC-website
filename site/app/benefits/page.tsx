import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getSalesCta, getCtaNav } from "@/lib/navigation";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.benefits.title,
  description: pageSeo.benefits.description,
  path: "/benefits",
});

const benefits = [
  {
    title: "One system for everyday operations",
    body: "Finance, sales, inventory and team workflows stay connected — fewer spreadsheets and handoffs.",
  },
  {
    title: "Plans that unlock modules as you grow",
    body: "Start with what you need. Upgrade features from your subscription without ripping out the stack.",
  },
  {
    title: "Built for Indian businesses",
    body: "INR pricing, GST-aware invoicing patterns and support oriented around local operating reality.",
  },
  {
    title: "Web and mobile ready",
    body: "Teams can work from the office or the field with a consistent LoopC ERP experience.",
  },
  {
    title: "Sold and supported by LoopC",
    body: "Subscription, onboarding and product access are managed by LoopC Business Strategies — the ERP product runs as its own application.",
  },
  {
    title: "Clear path from website to product",
    body: "Choose a plan, subscribe, and open the external ERP with an active entitlement — no duplicate dashboards on this marketing site.",
  },
];

export default function BenefitsPage() {
  const sales = getSalesCta();
  const start = getCtaNav();

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
        ])}
      />
      <PageHero
        eyebrow="Benefits"
        title="Why teams choose LoopC ERP"
        description="Practical outcomes for growing businesses — without turning this website into a second ERP."
        dark
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="lift-card premium-card rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <MagneticButton href={start.href}>{start.label}</MagneticButton>
          <MagneticButton href={sales.href} variant="light">
            {sales.label}
          </MagneticButton>
          <Link
            href="/features"
            className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            Explore features →
          </Link>
        </div>
      </Container>
    </div>
  );
}
