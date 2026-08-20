import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
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

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="type-h3 font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="on-dark rounded-2xl border border-slate-200/80 bg-[#050b16] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">Gallery</p>
              <p className="mt-3 text-sm text-slate-300">{project.galleryNote}</p>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
                Screenshots available on request
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Technology</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technology.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <section className="on-dark mt-16 rounded-3xl bg-[#050b16] p-8 text-white">
          <SectionHeader
            eyebrow="Next step"
            title="Have a similar challenge?"
            description="If your operation looks like this, we should talk before you stretch another spreadsheet."
            light
          />
          <Link
            href="/contact?intent=project"
            className="mt-6 inline-flex rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950"
          >
            Start a project
          </Link>
        </section>
      </Container>
    </div>
  );
}
