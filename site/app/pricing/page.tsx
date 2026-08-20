import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { Container } from "@/components/ui/container";
import { type ErpPlan, erpFetch, getErpPublicUrl } from "@/lib/erp-api";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ERP pricing",
  description:
    "LoopC ERP subscription plans in INR — Starter, Business, Professional and Enterprise.",
  path: "/pricing",
});

const fallbackPlans: ErpPlan[] = [
  {
    id: "starter",
    slug: "starter",
    name: "Starter",
    description: "For small teams getting started with core finance.",
    monthlyPriceInr: 199900,
    yearlyPriceInr: 1999900,
    isCustomPricing: false,
    isActive: true,
    sortOrder: 1,
    supportLevel: "email",
    features: [
      { id: "1", moduleKey: "accounting", enabled: true, label: "Accounting" },
      { id: "2", moduleKey: "invoicing", enabled: true, label: "Invoicing" },
    ],
    limits: [],
  },
  {
    id: "business",
    slug: "business",
    name: "Business",
    description: "Grow with inventory, CRM and stronger reporting.",
    monthlyPriceInr: 499900,
    yearlyPriceInr: 4999900,
    isCustomPricing: false,
    isActive: true,
    sortOrder: 2,
    supportLevel: "priority_email",
    features: [
      { id: "3", moduleKey: "inventory", enabled: true, label: "Inventory" },
      { id: "4", moduleKey: "crm", enabled: true, label: "CRM" },
    ],
    limits: [],
  },
  {
    id: "professional",
    slug: "professional",
    name: "Professional",
    description: "Full operations stack with HR, payroll and API access.",
    monthlyPriceInr: 999900,
    yearlyPriceInr: 9999900,
    isCustomPricing: false,
    isActive: true,
    sortOrder: 3,
    supportLevel: "phone_email",
    features: [
      { id: "5", moduleKey: "hr", enabled: true, label: "HR" },
      { id: "6", moduleKey: "payroll", enabled: true, label: "Payroll" },
    ],
    limits: [],
  },
  {
    id: "enterprise",
    slug: "enterprise",
    name: "Enterprise",
    description: "Custom limits, modules and priority support.",
    monthlyPriceInr: null,
    yearlyPriceInr: null,
    isCustomPricing: true,
    isActive: true,
    sortOrder: 4,
    supportLevel: "priority",
    features: [],
    limits: [],
  },
];

type PlansPayload = { plans: ErpPlan[] };

export default async function PricingPage() {
  const erp = getErpPublicUrl();
  const data = await erpFetch<PlansPayload>("/api/public/plans");
  const plans = data?.plans?.length ? data.plans : fallbackPlans;

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <PageHero
        eyebrow="Pricing"
        title="Plans that grow with your business."
        description="Subscribe monthly or yearly. Enterprise teams can talk to us for custom modules, limits and support."
        dark
      />
      <Container className="py-16 sm:py-20">
        <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">
          LoopC ERP plans include the modules your team needs today — with room to upgrade as
          operations expand. Enterprise pricing covers customization, integrations and priority support.
        </p>
        <PricingPlans plans={plans} erpBase={erp} />
        <p className="mt-10 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href={`${erp}/login`} className="font-semibold text-[var(--primary)] hover:underline">
            Log in to LoopC ERP
          </a>
        </p>
      </Container>
    </div>
  );
}
