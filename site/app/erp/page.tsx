import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ErpModulesGrid, ErpValueProps } from "@/components/home/erp-showcase-section";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import {
  type ErpWebsitePage,
  asStringArray,
  erpFetch,
  getErpPublicUrl,
  sectionByKey,
} from "@/lib/erp-api";
import { getSalesCta } from "@/lib/navigation";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "LoopC ERP | Business management software",
  description:
    "LoopC ERP brings finance, sales, inventory, CRM, HR and reporting into one connected workspace — web and mobile.",
  path: "/erp",
});

type PagePayload = { page: ErpWebsitePage };

export default async function ErpPage() {
  const erp = getErpPublicUrl();
  const salesCta = getSalesCta();
  const data = await erpFetch<PagePayload>("/api/public/pages/erp");
  const intro = sectionByKey(data?.page?.sections, "intro");
  const modules = asStringArray(
    intro?.contentJson && typeof intro.contentJson === "object"
      ? (intro.contentJson as { modules?: unknown }).modules
      : null,
  );

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "ERP", path: "/erp" },
        ])}
      />
      <PageHero
        eyebrow="LoopC ERP"
        title={intro?.title || data?.page?.title || "Run your business from one workspace."}
        description={
          intro?.subtitle ||
          intro?.body ||
          siteConfig.positioning.erpCopy
        }
        dark
      />

      <section className="section-light py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Web + mobile"
                title="Your team works from anywhere."
                description="LoopC ERP is built for daily use on desktop and mobile — finance at the desk, operations in the field, leadership on the move."
              />
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>— Responsive web app for office teams</li>
                <li>— Mobile-ready workflows for field and warehouse</li>
                <li>— Role-based views so people see what they need</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-[#050b16] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">Product UI concept</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Web dashboard</p>
                  <p className="mt-1 text-xs text-slate-400">Finance, sales and inventory at a glance</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Mobile access</p>
                  <p className="mt-1 text-xs text-slate-400">Approvals, stock checks and tasks on the go</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ErpModulesGrid modules={modules.length ? modules : undefined} />
      <ErpValueProps />

      <section className="section-light py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Multi-tenant & access"
            title="Built for teams, roles and growing organizations."
            description="Configure who sees what. LoopC ERP supports role-based access so finance, sales, warehouse and leadership each work from the same connected data."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Role-based access", copy: "Permissions aligned to job functions." },
              { title: "Multi-tenant ready", copy: "Separate data for each organization you manage." },
              { title: "Audit-friendly", copy: "Track who changed what and when." },
            ].map((item) => (
              <div key={item.title} className="lift-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-dark py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHeader
            eyebrow="Pricing"
            title="Plans that grow with your business."
            description="Start with the modules you need. Upgrade as your team and operations expand."
            light
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={intro?.ctaHref || "/pricing"}
              className="btn-primary inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {intro?.ctaLabel || "View pricing"}
            </Link>
            <Link
              href={`${erp}/signup`}
              className="btn-secondary inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </div>
        </Container>
      </section>

      <section className="section-light py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Customization"
            title="Need more than the standard modules?"
            description="We extend LoopC ERP with custom modules, workflows, reports and integrations tailored to your organization."
          />
          <Link
            href="/contact?intent=expert&service=erp-customization"
            className="mt-6 inline-flex text-sm font-semibold text-teal-700 hover:underline"
          >
            Talk about ERP customization →
          </Link>
        </Container>
      </section>

      <section className="section-dark py-16 sm:py-20">
        <Container className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center sm:px-12">
          <h2 className="type-h2 font-bold text-white">Ready to explore LoopC ERP?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Compare plans, start a subscription, or talk to us about enterprise requirements.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pricing"
              className="btn-primary inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              View pricing
            </Link>
            <Link
              href={salesCta.href}
              className="btn-secondary inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {salesCta.label}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
