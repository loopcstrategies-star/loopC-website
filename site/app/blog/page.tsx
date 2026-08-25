import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { type ErpBlogPost, erpFetch } from "@/lib/erp-api";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.blog.title,
  description: pageSeo.blog.description,
  path: "/blog",
});

type BlogPayload = { posts: ErpBlogPost[] };

export default async function BlogIndexPage() {
  const data = await erpFetch<BlogPayload>("/api/public/blog");
  const posts = data?.posts ?? [];

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Insights"
        title="Blog & insights"
        description="Practical notes on ERP, custom software and growing operations — from the LoopC team."
      />
      <Container className="py-16 sm:py-20">
        {posts.length === 0 ? (
          <p className="text-slate-600">
            New articles are on the way.{" "}
            <Link href="/contact" className="font-semibold text-[var(--primary)] hover:underline">
              Contact us
            </Link>{" "}
            if you have a topic in mind.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="lift-card premium-card h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  {post.category ? (
                    <p className="type-label text-[var(--primary)]">{post.category.name}</p>
                  ) : null}
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    <Link href={`/blog/${post.slug}`} className="hover:text-[var(--primary)]">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                  ) : null}
                  <p className="mt-4 text-xs text-slate-400">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : null}
                    {post.authorName ? ` · ${post.authorName}` : null}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
