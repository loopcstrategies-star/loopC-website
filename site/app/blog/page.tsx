import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { type ErpBlogPost, erpFetch } from "@/lib/erp-api";
import { formatInsightDate, insightPosts } from "@/lib/insights";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Practical writing from LoopC on ERP, custom software, websites and building products for business.",
  path: "/blog",
});

type Payload = { posts: ErpBlogPost[] };

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  try {
    return formatInsightDate(value.slice(0, 10));
  } catch {
    return value;
  }
}

export default async function BlogPage() {
  const data = await erpFetch<Payload>("/api/public/blog");
  const cmsPosts = data?.posts ?? [];

  const items =
    cmsPosts.length > 0
      ? cmsPosts.map((post) => ({
          slug: post.slug,
          title: post.title,
          description: post.excerpt || post.seoDescription || "",
          category: post.category?.name || "Blog",
          date: formatDate(post.publishedAt),
        }))
      : insightPosts
          .slice()
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
          .map((post) => ({
            slug: post.slug,
            title: post.title,
            description: post.description,
            category: post.category,
            date: formatInsightDate(post.publishedAt),
          }));

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Blog"
        title="Clear writing about building software for business."
        description="ERP, custom builds, websites vs apps, and how to choose a partner."
        dark
      />
      <Container className="grid gap-4 py-16 sm:py-20">
        {items.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="lift-card premium-card rounded-2xl border border-slate-200 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              {post.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{post.title}</h2>
            <p className="mt-2 text-slate-600">{post.description}</p>
            {post.date ? <p className="mt-4 text-sm text-slate-500">{post.date}</p> : null}
          </Link>
        ))}
      </Container>
    </div>
  );
}
