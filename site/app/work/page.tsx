import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { projects } from "@/lib/projects";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our work",
  description:
    "Selected LoopC work. We only publish projects we can stand behind — starting with Coacher Max, a live education product.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ])}
      />
      <PageHero
        eyebrow="Work"
        title="Selected work, honestly presented."
        description="No invented logos or metrics. When we have more public stories, they will appear here."
        dark
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={project.href}
              className="lift-card rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <p className="type-label text-teal-700">{project.sector}</p>
              <h2 className="type-h3 mt-3 font-semibold text-slate-950">{project.title}</h2>
              <p className="mt-3 max-w-2xl text-slate-600">{project.summary}</p>
              <p className="mt-5 text-sm font-semibold text-teal-700">View the product</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
