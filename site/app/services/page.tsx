import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Software development services in Chennai",
  description:
    "Mobile apps, websites, web applications, dashboards, custom software, UI/UX, automation and integrations — designed and built by LoopC in OMR, Chennai.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        eyebrow="Services"
        title="What LoopC designs and builds."
        description="Nine services, one partner. We start with the business problem, then choose the product — app, website, dashboard or custom system — that should exist."
        dark
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={service.href}
              className="lift-card rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
              <p className="mt-2 text-slate-600">{service.summary}</p>
              <p className="mt-4 text-sm font-semibold text-teal-700">View {service.shortTitle}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
