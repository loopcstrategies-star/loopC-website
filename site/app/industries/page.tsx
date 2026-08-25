import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import {
  type ErpWebsitePage,
  erpFetch,
  sectionByKey,
} from "@/lib/erp-api";
import { industries } from "@/lib/industries";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.industries.title,
  description: pageSeo.industries.description,
  path: "/industries",
});

type PagePayload = { page: ErpWebsitePage };

export default async function IndustriesPage() {
  const data = await erpFetch<PagePayload>("/api/public/pages/industries");
  const hero = sectionByKey(data?.page?.sections, "hero");

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
        title={hero?.title || "Technology that understands the business behind it."}
        description={
          hero?.subtitle ||
          hero?.body ||
          "We design software around how these operations run. These pages describe the problems we solve — not a claim that we are the only specialist in the vertical."
        }
        dark
      />
      <Container className="grid gap-4 py-16 sm:py-20 md:grid-cols-2">
        {industries.map((industry) => (
          <Link
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            className="lift-card premium-card rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-950">{industry.title}</h2>
            <p className="mt-2 text-slate-600">{industry.summary}</p>
            <p className="mt-4 text-sm font-semibold text-[var(--primary)]">View industry</p>
          </Link>
        ))}
      </Container>
    </div>
  );
}
