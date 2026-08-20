import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import {
  getIndustry,
  getIndustryCustomOpportunities,
  getIndustryErpModules,
  getIndustryProblems,
  industries,
} from "@/lib/industries";
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
    title: `${industry.title} software | ERP & custom systems`,
    description: getIndustryDescription(industry),
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const problems = getIndustryProblems(industry);
  const erpModules = getIndustryErpModules(industry);
  const customOpportunities = getIndustryCustomOpportunities(industry);
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
      <PageHero eyebrow="Industry" title={industry.title} description={industry.summary} dark />
      <Container className="space-y-14 py-16 sm:py-20">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <SectionHeader eyebrow="The challenge" title={industry.problem} description={industry.solution} />
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6">
            <h2 className="font-semibold text-slate-950">What better looks like</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{industry.outcome}</p>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Common problems" title="Where software usually helps first." />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {problems.map((item) => (
              <li key={item} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeader
            eyebrow="LoopC ERP"
            title="ERP modules that often matter in this industry."
            description="Start with LoopC ERP or talk to us about extending it for your workflow."
          />
          <ul className="mt-6 flex flex-wrap gap-2">
            {erpModules.map((module) => (
              <li
                key={module}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
              >
                {module}
              </li>
            ))}
          </ul>
          <Link href="/erp" className="mt-4 inline-block text-sm font-semibold text-teal-700 hover:underline">
            Explore LoopC ERP →
          </Link>
        </section>

        <section>
          <SectionHeader
            eyebrow="Custom software"
            title="When you need something built around your workflow."
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {customOpportunities.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeader eyebrow="Workflows" title="Examples of paths we design for." />
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {industry.workflows.map((item) => (
              <li key={item} className="rounded-2xl border border-slate-200/80 bg-white p-4 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeader eyebrow="Services" title="Relevant ways to work with LoopC." />
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
          <SectionHeader eyebrow="FAQ" title="Questions we hear." />
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
          <h2 className="text-2xl font-semibold">Discuss software for {industry.title.toLowerCase()}</h2>
          <p className="mt-2 max-w-xl text-slate-300">
            Bring the workflow. We will help you choose ERP, custom software, or both.
          </p>
          <Link
            href={`/contact?intent=expert&service=custom-software`}
            className="mt-6 inline-flex rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950"
          >
            Talk to an expert
          </Link>
        </section>
      </Container>
    </div>
  );
}
