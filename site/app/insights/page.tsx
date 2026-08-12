import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { formatInsightDate, insightPosts } from "@/lib/insights";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights on software, apps and business systems",
  description:
    "Practical writing from LoopC on custom software, websites vs web apps, dashboards, mobile products and choosing a development partner in Chennai.",
  path: "/insights",
});

export default function InsightsPage() {
  const posts = [...insightPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ])}
      />
      <PageHero
        eyebrow="Insights"
        title="Clear writing about building software for business."
        description="Topics we are asked about: when to custom-build, when a website is enough, how dashboards should work, and how to choose a partner."
        dark
      />
      <Container className="grid gap-4 py-16 sm:py-20">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/insights/${post.slug}`}
            className="lift-card rounded-2xl border border-slate-200 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              {post.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{post.title}</h2>
            <p className="mt-2 text-slate-600">{post.description}</p>
            <p className="mt-4 text-sm text-slate-500">
              {formatInsightDate(post.publishedAt)} · {post.readingMinutes} min read
            </p>
          </Link>
        ))}
      </Container>
    </div>
  );
}
