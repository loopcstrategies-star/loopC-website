import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { type ErpBlogPost, erpFetch } from "@/lib/erp-api";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

type PostPayload = { post: ErpBlogPost };

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await erpFetch<PostPayload>(`/api/public/blog/${encodeURIComponent(slug)}`);
  const post = data?.post;
  if (!post) {
    return pageMetadata({
      title: "Article not found | LoopC",
      description: "This blog post is unavailable.",
      path: `/blog/${slug}`,
    });
  }
  return pageMetadata({
    title: post.seoTitle || `${post.title} | LoopC Blog`,
    description: post.seoDescription || post.excerpt || post.title,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const data = await erpFetch<PostPayload>(`/api/public/blog/${encodeURIComponent(slug)}`);
  const post = data?.post;
  if (!post) notFound();

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <PageHero
        eyebrow={post.category?.name || "Blog"}
        title={post.title}
        description={post.excerpt || ""}
      />
      <Container className="max-w-3xl py-16 sm:py-20">
        <p className="text-sm text-slate-500">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null}
          {post.authorName ? ` · ${post.authorName}` : null}
        </p>
        <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-slate-700">
          {post.content || post.excerpt || ""}
        </div>
        <p className="mt-12">
          <Link href="/blog" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            ← All posts
          </Link>
        </p>
      </Container>
    </div>
  );
}
