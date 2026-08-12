import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getIndustry, industries } from "@/lib/industries";
import { getBreadcrumbSchema, getIndustryDescription, pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";

type Params = { slug: string };

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return pageMetadata({
    title: `Software for ${industry.title.toLowerCase()} businesses | Chennai`,
    description: getIndustryDescription(industry),
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const related = industry.relevantServices
    .map((item) => getService(item))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.title, path: `/industries/${industry.slug}` },
        ])}
      />
      <PageHero
        eyebrow="Industry"
        title={industry.title}
        description={industry.summary}
        dark
      />
      <Container className="space-y-14 py-16 sm:py-20">
        <section className="grid gap-6 md:grid-cols-3">
          <Block title="Challenges" items={industry.challenges} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-950">How LoopC approaches it</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{industry.solution}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{industry.outcome}</p>
          </div>
          <Block title="Software capabilities" items={industry.capabilities} />
        </section>

        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Workflow examples</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {industry.workflows.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-950">Dashboard thinking</h2>
          <p className="mt-2 text-sm text-slate-600">
            Illustrative only: the views that usually matter first are volume, exceptions and
            money in motion. We design the real board after we see your definitions.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Today’s volume", "Exceptions", "Outstanding"].map((label) => (
              <div key={label} className="rounded-xl bg-white p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">—</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Relevant services</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((service) => (
              <li key={service.slug}>
                <Link
                  href={service.href}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Questions</h2>
          <div className="mt-4 space-y-3">
            {industry.faqs.map((item) => (
              <details key={item.q} className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-medium text-slate-900">{item.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-[#050b16] px-6 py-10 text-white">
          <h2 className="text-2xl font-semibold">Discuss a {industry.title.toLowerCase()} system</h2>
          <p className="mt-2 max-w-xl text-slate-300">
            Bring the workflow. We will tell you what is worth building.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950"
          >
            Start a Project
          </Link>
        </section>
      </Container>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
