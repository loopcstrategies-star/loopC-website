import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = pageMetadata({
  title: "Software solutions for growing businesses",
  description:
    "Custom business systems, dashboards, digital products, and automation — assembled around how your company actually operates.",
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
        title="Systems we assemble around the work."
        description="Not a catalogue of modules. Four ways LoopC turns a business problem into software people will use."
        dark
      />
      <Container className="grid gap-4 py-16 sm:py-20 md:grid-cols-2">
        {solutions.map((solution) => (
          <article key={solution.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-950">{solution.title}</h2>
            <p className="mt-3 text-slate-600">{solution.summary}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              {solution.points.map((point) => (
                <li key={point}>— {point}</li>
              ))}
            </ul>
            <Link href={solution.href} className="mt-5 inline-block text-sm font-semibold text-teal-700">
              Explore this path
            </Link>
          </article>
        ))}
      </Container>
    </div>
  );
}
