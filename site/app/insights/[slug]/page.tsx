import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/ui/container";
import {
  formatInsightDate,
  getInsight,
  getRelatedInsights,
  insightAuthor,
  insightPosts,
} from "@/lib/insights";
import { getArticleSchema, getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return insightPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/insights/${post.slug}`,
    type: "article",
  });
}

export default async function InsightArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) notFound();
  const related = getRelatedInsights(post.slug);

  return (
    <article>
      <JsonLd data={getArticleSchema(post)} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: post.title, path: `/insights/${post.slug}` },
        ])}
      />
      <header className="bg-[#050b16] py-16 text-white sm:py-20">
        <Container className="max-w-3xl">
          <p className="type-label text-teal-300">{post.category}</p>
          <h1 className="type-h1 mt-3 font-bold text-white">{post.title}</h1>
          <p className="mt-5 text-slate-300">{post.description}</p>
          <p className="mt-6 text-sm text-slate-400">
            {insightAuthor} · {formatInsightDate(post.publishedAt)}
            {post.updatedAt !== post.publishedAt
              ? ` · Updated ${formatInsightDate(post.updatedAt)}`
              : ""}{" "}
            · {post.readingMinutes} min read
          </p>
        </Container>
      </header>
      <Container className="max-w-3xl py-14 sm:py-16">
        <div className="space-y-10">
          {post.body.map((block, index) => (
            <section key={block.heading ?? index}>
              {block.heading ? (
                <h2 className="type-h3 font-semibold text-slate-950">{block.heading}</h2>
              ) : null}
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        {related.length ? (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <h2 className="font-semibold text-slate-950">Related reading</h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/insights/${item.slug}`} className="text-teal-700 hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="mt-12 rounded-3xl bg-[#050b16] p-8 text-white">
          <h2 className="text-2xl font-semibold text-white">Want this applied to your business?</h2>
          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950"
          >
            Start a Project
          </Link>
        </section>
      </Container>
    </article>
  );
}
