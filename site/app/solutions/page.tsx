import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.solutions.title,
  description: pageSeo.solutions.description,
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />
      <PageHero
        eyebrow="Solutions"
        title="Software solutions for growing businesses."
        description="LoopC ERP for connected operations — or custom software when your workflow needs something built around it."
        dark
      />
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Explore"
          title="Choose the path that fits your business."
          description="Every solution links to a product page, service or conversation with our team."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {solutions.map((solution) => (
            <article
              key={solution.slug}
              className="lift-card premium-card rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-950">{solution.title}</h2>
              <p className="mt-3 text-slate-600">{solution.summary}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                {solution.points.map((point) => (
                  <li key={point}>— {point}</li>
                ))}
              </ul>
              <Link href={solution.href} className="mt-5 inline-block text-sm font-semibold text-[var(--primary)]">
                Explore {solution.title} →
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
