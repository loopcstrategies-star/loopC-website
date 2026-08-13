import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/ui/container";
import { asStringArray, type ErpBlogPost, erpFetch } from "@/lib/erp-api";
import {
  formatInsightDate,
  getInsight,
  insightAuthor,
} from "@/lib/insights";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

type Params = { slug: string };
type Payload = { post: ErpBlogPost };

function paragraphsFromContent(content: string | null | undefined): string[] {
  if (!content?.trim()) return [];
  return content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await erpFetch<Payload>(`/api/public/blog/${slug}`);
  const cms = data?.post;
  const local = getInsight(slug);
  const title = cms?.seoTitle || cms?.title || local?.title;
  if (!title) return {};
  return pageMetadata({
    title,
    description: cms?.seoDescription || cms?.excerpt || local?.description || title,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const data = await erpFetch<Payload>(`/api/public/blog/${slug}`);
  const cms = data?.post;
  const local = getInsight(slug);

  if (!cms && !local) notFound();

  const title = cms?.title || local!.title;
  const description = cms?.excerpt || local?.description || "";
  const category = cms?.category?.name || local?.category || "Blog";
  const author = cms?.authorName || insightAuthor;
  const published = cms?.publishedAt
    ? formatInsightDate(cms.publishedAt.slice(0, 10))
    : local
      ? formatInsightDate(local.publishedAt)
      : "";
  const tags = asStringArray(cms?.tagsJson).length
    ? asStringArray(cms?.tagsJson)
    : local?.tags || [];
  const cmsParagraphs = paragraphsFromContent(cms?.content);

  return (
    <article>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: title, path: `/blog/${slug}` },
        ])}
      />
      <header className="bg-[#050b16] py-16 text-white sm:py-20">
        <Container className="max-w-3xl">
          <p className="type-label text-teal-300">{category}</p>
          <h1 className="type-h1 mt-3 font-bold">{title}</h1>
          {description ? <p className="mt-5 text-slate-300">{description}</p> : null}
          <p className="mt-6 text-sm text-slate-400">
            {author}
            {published ? ` · ${published}` : ""}
          </p>
        </Container>
      </header>
      <Container className="max-w-3xl py-14 sm:py-16">
        {cmsParagraphs.length ? (
          <div className="space-y-6">
            {cmsParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
        ) : local ? (
          <div className="space-y-10">
            {local.body.map((block, index) => (
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
        ) : null}
        {tags.length ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <section className="mt-12 rounded-3xl bg-[#050b16] p-8 text-white">
          <h2 className="text-2xl font-semibold">Want this applied to your business?</h2>
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
