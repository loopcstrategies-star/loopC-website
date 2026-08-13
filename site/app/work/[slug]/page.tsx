import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getProject, projects } from "@/lib/projects";
import { getBreadcrumbSchema, getProjectDescription, pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title} — LoopC work`,
    description: getProjectDescription(project),
    path: project.href,
  });
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const sections = [
    { title: "Challenge", body: project.challenge },
    { title: "Approach", body: project.approach },
    { title: "Product", body: project.product },
    { title: "Result", body: project.result },
  ];

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: project.href },
        ])}
      />
      <PageHero eyebrow={project.sector} title={project.title} description={project.summary} dark />
      <Container className="max-w-3xl py-16 sm:py-20">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="type-h3 font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
        <section className="mt-10">
          <h2 className="type-h3 font-semibold text-slate-950">Technology</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technology.map((item) => (
              <li
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="font-semibold text-slate-950">Gallery</h2>
          <p className="mt-2 text-sm text-slate-600">{project.galleryNote}</p>
        </section>
        <section className="mt-12 rounded-3xl bg-[#050b16] p-8 text-white">
          <h2 className="text-2xl font-semibold">Have a similar challenge?</h2>
          <p className="mt-2 text-slate-300">
            If your operation looks like this, we should talk before you stretch another
            spreadsheet.
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
