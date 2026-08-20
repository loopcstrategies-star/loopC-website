import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Software services | Web, mobile, ERP & custom systems",
  description:
    "LoopC delivers web applications, mobile apps, dashboards, automation, UI/UX and custom business software — plus ERP customization.",
  path: "/services",
});

const serviceGroups = [
  { label: "Web & product", slugs: ["web-development", "web-applications", "ui-ux"] },
  { label: "Mobile", slugs: ["mobile-app-development"] },
  { label: "Custom & dashboards", slugs: ["custom-software", "dashboard-development"] },
  { label: "Automation & integrations", slugs: ["business-automation", "api-integrations"] },
  { label: "Support", slugs: ["support-growth"] },
] as const;

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
        title="Software services for growing businesses."
        description="Web, mobile, dashboards, automation and custom systems — plus ERP customization when you need to extend LoopC ERP."
        dark
      />
      <Container className="space-y-16 py-16 sm:py-20">
        {serviceGroups.map((group) => {
          const items = group.slugs
            .map((slug) => services.find((s) => s.slug === slug))
            .filter((s): s is (typeof services)[number] => Boolean(s));

          return (
            <section key={group.label}>
              <h2 className="type-h3 font-semibold text-slate-950">{group.label}</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {items.map((service) => (
                  <Link
                    key={service.slug}
                    href={service.href}
                    className="lift-card rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
                    <p className="mt-2 text-slate-600">{service.summary}</p>
                    <p className="mt-3 text-sm text-slate-500">{service.whoFor}</p>
                    <p className="mt-4 text-sm font-semibold text-teal-700">View {service.shortTitle}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-3xl border border-teal-200/60 bg-teal-50/50 p-6 sm:p-8">
          <SectionHeader
            eyebrow="ERP"
            title="ERP customization"
            description="Extend LoopC ERP with custom modules, workflows, reports and integrations tailored to your organization."
          />
          <Link
            href="/contact?intent=expert&service=erp-customization"
            className="mt-4 inline-flex text-sm font-semibold text-teal-800 hover:underline"
          >
            Talk about ERP customization →
          </Link>
        </section>
      </Container>
    </div>
  );
}
