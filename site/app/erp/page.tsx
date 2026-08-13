import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import {
  type ErpWebsitePage,
  asStringArray,
  erpFetch,
  getErpPublicUrl,
  sectionByKey,
} from "@/lib/erp-api";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LoopC ERP",
  description:
    "One workspace for accounting, inventory, CRM, HR and more — subscription-gated modules for growing businesses.",
  path: "/erp",
});

const defaultModules = [
  "Accounting",
  "Inventory",
  "CRM",
  "Sales",
  "Purchasing",
  "HR",
  "Payroll",
  "Invoicing",
  "Reports",
  "Business Analytics",
];

type PagePayload = { page: ErpWebsitePage };

export default async function ErpPage() {
  const erp = getErpPublicUrl();
  const data = await erpFetch<PagePayload>("/api/public/pages/erp");
  const intro = sectionByKey(data?.page?.sections, "intro");
  const modules = asStringArray(
    intro?.contentJson && typeof intro.contentJson === "object"
      ? (intro.contentJson as { modules?: unknown }).modules
      : null,
  );
  const moduleList = modules.length ? modules : defaultModules;

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "ERP", path: "/erp" },
        ])}
      />
      <PageHero
        eyebrow="ERP"
        title={intro?.title || data?.page?.title || "LoopC ERP"}
        description={
          intro?.subtitle ||
          intro?.body ||
          "One workspace for accounting, inventory, CRM, HR and more."
        }
        dark
      />
      <Container className="py-16 sm:py-20">
        {intro?.body ? (
          <p className="max-w-3xl text-lg leading-relaxed text-slate-600">{intro.body}</p>
        ) : null}
        <h2 className="type-h3 mt-12 font-semibold text-slate-950">Modules</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {moduleList.map((name) => (
            <li
              key={name}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800"
            >
              {name}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href={intro?.ctaHref || "/pricing"}
            className="inline-flex rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {intro?.ctaLabel || "View pricing"}
          </Link>
          <Link
            href={`${erp}/signup`}
            className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800"
          >
            Start free trial
          </Link>
        </div>
      </Container>
    </div>
  );
}
