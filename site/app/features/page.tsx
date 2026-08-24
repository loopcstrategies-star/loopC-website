import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import {
  type ErpWebsitePage,
  asStringArray,
  erpFetch,
  sectionByKey,
} from "@/lib/erp-api";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ERP features",
  description:
    "LoopC ERP modules unlock from your subscription — accounting, inventory, CRM, HR and more.",
  path: "/features",
});

const defaultModules = [
  "Accounting",
  "Invoicing",
  "Inventory",
  "CRM",
  "Reports",
  "HR",
  "Payroll",
  "API",
];

type PagePayload = { page: ErpWebsitePage };

export default async function FeaturesPage() {
  const [featuresData, erpData] = await Promise.all([
    erpFetch<PagePayload>("/api/public/pages/features"),
    erpFetch<PagePayload>("/api/public/pages/erp"),
  ]);

  const intro =
    sectionByKey(featuresData?.page?.sections, "intro") ||
    sectionByKey(erpData?.page?.sections, "intro");

  const fromFeatures = asStringArray(
    intro?.contentJson && typeof intro.contentJson === "object"
      ? (intro.contentJson as { modules?: unknown }).modules
      : null,
  );
  const fromErp = asStringArray(
    sectionByKey(erpData?.page?.sections, "intro")?.contentJson &&
      typeof sectionByKey(erpData?.page?.sections, "intro")?.contentJson === "object"
      ? (
          sectionByKey(erpData?.page?.sections, "intro")!.contentJson as {
            modules?: unknown;
          }
        ).modules
      : null,
  );
  const modules = fromFeatures.length
    ? fromFeatures
    : fromErp.length
      ? fromErp
      : defaultModules;

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      <PageHero
        eyebrow="Features"
        title={intro?.title || featuresData?.page?.title || "ERP features that match your plan"}
        description={
          intro?.subtitle ||
          intro?.body ||
          "Modules unlock from your subscription — enforced on the server."
        }
        dark
      />
      <Container className="py-16 sm:py-20">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((name) => (
            <li
              key={name}
              className="lift-card premium-card rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900"
            >
              {name}
            </li>
          ))}
        </ul>
        <Link
          href="/pricing"
          className="mt-12 inline-flex rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          See plans
        </Link>
      </Container>
    </div>
  );
}
