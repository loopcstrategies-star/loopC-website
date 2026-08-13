import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Container, SectionLabel } from "@/components/ui/container";
import type { ErpCmsService } from "@/lib/erp-api";
import { asStringArray } from "@/lib/erp-api";

const fallbackServices: Array<{
  slug: string;
  name: string;
  summary: string;
  href: string;
}> = [
  {
    slug: "erp-solutions",
    name: "ERP Solutions",
    summary: "Subscribe to LoopC ERP and run operations in one place.",
    href: "/erp",
  },
  {
    slug: "custom-software",
    name: "Custom Software",
    summary: "Software designed around your workflows.",
    href: "/contact",
  },
  {
    slug: "web-development",
    name: "Web Development",
    summary: "High-performance websites and web apps.",
    href: "/services",
  },
  {
    slug: "mobile-apps",
    name: "Mobile Apps",
    summary: "Native-quality apps for customers and field teams.",
    href: "/services",
  },
  {
    slug: "saas-products",
    name: "SaaS Products",
    summary: "Multi-tenant products with billing and roles.",
    href: "/erp",
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    summary: "Automate repetitive work and connect systems.",
    href: "/contact",
  },
];

function serviceHref(service: ErpCmsService): string {
  if (service.ctaHref) return service.ctaHref;
  if (service.slug === "erp-solutions") return "/erp";
  return `/services`;
}

export function ServicesSection({ services }: { services?: ErpCmsService[] | null }) {
  const items =
    services && services.length > 0
      ? services.map((s) => ({
          slug: s.slug,
          name: s.name,
          summary: s.summary || s.description || "",
          href: serviceHref(s),
          features: asStringArray(s.featuresJson),
        }))
      : fallbackServices.map((s) => ({ ...s, features: [] as string[] }));

  return (
    <section className="bg-[#f4f6fa] py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionLabel>01 — What we build</SectionLabel>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold text-slate-950">
            Software for the way the business already works.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            ERP, custom products, websites and apps — one team that starts with the workflow.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <FadeIn key={service.slug} delay={index * 0.04}>
              <Link
                href={service.href}
                className="lift-card group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="type-h3 mt-4 font-semibold text-slate-950">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.summary}</p>
                {service.features.length ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {service.features.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <span className="mt-4 text-sm font-semibold text-teal-700 group-hover:underline">
                  Learn more
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
