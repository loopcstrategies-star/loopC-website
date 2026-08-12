import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, getServiceSchema, pageMetadata } from "@/lib/seo";
import { getRelatedServices, getService, services } from "@/lib/services";

type Params = { slug: string };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.title} | Software development Chennai`,
    description: service.description,
    path: service.href,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = getRelatedServices(service.slug);

  return (
    <div>
      <JsonLd data={getServiceSchema(service)} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: service.href },
        ])}
      />
      <PageHero eyebrow="Service" title={service.title} description={service.description} dark />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] sm:py-20">
        <div>
          <h2 className="type-h3 font-semibold text-slate-950">Who it is for</h2>
          <p className="mt-3 text-slate-600">{service.whoFor}</p>
          <h2 className="type-h3 mt-10 font-semibold text-slate-950">What the work includes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            {service.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="type-h3 mt-10 font-semibold text-slate-950">What you should expect</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            {service.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <p className="font-semibold text-slate-950">Start this conversation</p>
          <p className="mt-2 text-sm text-slate-600">
            Tell us the workflow. We will tell you whether this service is the right shape.
          </p>
          <Link
            href={`/contact?service=${service.slug}`}
            className="btn-primary mt-5 inline-flex rounded-full bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Start a Project
          </Link>
          {related.length ? (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Related</p>
              <ul className="mt-3 space-y-2 text-sm">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={item.href} className="text-teal-700 hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </Container>
    </div>
  );
}
