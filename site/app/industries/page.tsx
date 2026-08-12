import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { industries } from "@/lib/industries";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Software for trading, retail, manufacturing and more",
  description:
    "LoopC builds software for trading, wholesale, distribution, manufacturing, retail, education and professional services from OMR, Chennai.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ])}
      />
      <PageHero
        eyebrow="Industries"
        title="Technology that understands the business behind it."
        description="We design software around how these operations run. These pages describe the problems we solve — not a claim that we are the only specialist in the vertical."
        dark
      />
      <Container className="grid gap-4 py-16 sm:py-20 md:grid-cols-2">
        {industries.map((industry) => (
          <Link
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            className="lift-card rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-950">{industry.title}</h2>
            <p className="mt-2 text-slate-600">{industry.summary}</p>
            <p className="mt-4 text-sm font-semibold text-teal-700">View industry</p>
          </Link>
        ))}
      </Container>
    </div>
  );
}
