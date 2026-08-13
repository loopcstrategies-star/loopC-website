import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container, SectionLabel } from "@/components/ui/container";
import {
  type ErpPlan,
  formatInrFromPaise,
  getErpPublicUrl,
} from "@/lib/erp-api";

const fallbackPlans: Array<{
  slug: string;
  name: string;
  description: string;
  monthlyPriceInr: number | null;
  isCustomPricing: boolean;
}> = [
  {
    slug: "starter",
    name: "Starter",
    description: "Core finance for small teams.",
    monthlyPriceInr: 199900,
    isCustomPricing: false,
  },
  {
    slug: "business",
    name: "Business",
    description: "Inventory, CRM and stronger reporting.",
    monthlyPriceInr: 499900,
    isCustomPricing: false,
  },
  {
    slug: "professional",
    name: "Professional",
    description: "Full stack with HR, payroll and API.",
    monthlyPriceInr: 999900,
    isCustomPricing: false,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    description: "Custom limits and priority support.",
    monthlyPriceInr: null,
    isCustomPricing: true,
  },
];

export function HomePricingPreview({ plans }: { plans?: ErpPlan[] | null }) {
  const erp = getErpPublicUrl();
  const items =
    plans && plans.length > 0
      ? plans.slice(0, 4)
      : (fallbackPlans as unknown as ErpPlan[]);

  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold text-slate-950">
            LoopC ERP plans that grow with you.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Transparent INR pricing. Unlock modules as you subscribe — no shelf-ware.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((plan, index) => {
            const price =
              plan.isCustomPricing || plan.monthlyPriceInr == null
                ? "Contact sales"
                : `${formatInrFromPaise(plan.monthlyPriceInr)}/mo`;
            return (
              <FadeIn key={plan.slug} delay={index * 0.04}>
                <div className="lift-card flex h-full flex-col rounded-2xl border border-slate-200 bg-[#f4f6fa] p-5">
                  <h3 className="font-semibold text-slate-950">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-bold text-teal-800">{price}</p>
                  <p className="mt-3 flex-1 text-sm text-slate-600">
                    {plan.description || ""}
                  </p>
                  <Link
                    href={
                      plan.isCustomPricing
                        ? "/contact"
                        : `${erp}/signup?plan=${encodeURIComponent(plan.slug)}`
                    }
                    className="mt-5 text-sm font-semibold text-teal-700 hover:underline"
                  >
                    {plan.isCustomPricing ? "Contact sales" : "Choose plan"}
                  </Link>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <MagneticButton href="/pricing" variant="light">
            Compare all plans
          </MagneticButton>
        </div>
      </Container>
    </section>
  );
}
