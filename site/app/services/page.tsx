import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { ServiceExplorer } from "@/components/services/service-explorer";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.services.title,
  description: pageSeo.services.description,
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
        title="Digital Solutions Built for Modern Businesses"
        description="From websites and mobile applications to complex business platforms, we design and develop digital solutions that are built around your goals."
        dark
        backgroundImage="/images/page-heroes/services.jpg"
      />

      {/* Interactive service explorer */}
      <section className="bg-white py-20 sm:py-24">
        <Container>
          <FadeIn>
            <p className="type-label text-[var(--primary)]">Service explorer</p>
            <h2 className="type-h2 mt-3 max-w-2xl font-bold text-slate-950">
              What would you like to build?
            </h2>
            <p className="mt-4 max-w-xl text-slate-600">
              Select a service to explore what we deliver, the technologies we use, and how to get started.
            </p>
          </FadeIn>
          <ServiceExplorer />
        </Container>
      </section>

      {/* ERP CTA */}
      <section className="section-light py-16 sm:py-20">
        <Container>
          <FadeIn>
            <div className="rounded-3xl border border-blue-200/60 bg-blue-50/50 p-8 sm:p-10">
              <p className="type-label text-[var(--primary)]">ERP product</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Looking for a complete business ERP?
              </h2>
              <p className="mt-3 max-w-xl text-slate-600">
                LoopC ERP brings finance, inventory, CRM, HR, sales and reporting into one connected
                platform. Explore plans and start a subscription.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/erp"
                  className="inline-flex rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  Explore LoopC ERP
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex rounded-full border border-blue-300 bg-white px-5 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
