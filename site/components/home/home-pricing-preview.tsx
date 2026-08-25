import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container } from "@/components/ui/container";
import { type ErpPlan, formatInrFromPaise, getErpPublicUrl } from "@/lib/erp-api";

const fallbackPlans: Array<{
  slug: string;
  name: string;
  description: string;
  monthlyPriceInr: number | null;
  isCustomPricing: boolean;
  isPopular?: boolean;
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
    isPopular: true,
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
    plans && plans.length > 0 ? plans.slice(0, 4) : (fallbackPlans as unknown as ErpPlan[]);

  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <p className="type-label text-[var(--primary)]">ERP Pricing</p>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold text-[var(--text)]">
            Plans that grow with your business.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Transparent INR pricing from live catalog data. Unlock modules as you subscribe.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((plan, index) => {
            const price =
              plan.isCustomPricing || plan.monthlyPriceInr == null
                ? "Contact sales"
                : `${formatInrFromPaise(plan.monthlyPriceInr)}/mo`;
            const popular = Boolean(plan.isPopular);
            return (
              <FadeIn key={plan.slug} delay={index * 0.04}>
                <div
                  className={`lift-card premium-card relative flex h-full flex-col rounded-2xl border bg-[var(--background)] p-5 ${
                    popular
                      ? "border-transparent bg-gradient-to-b from-blue-50 to-violet-50 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30"
                      : "border-[var(--border)]"
                  }`}
                >
                  {popular ? (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Popular
                    </span>
                  ) : null}
                  <h3 className="font-semibold text-[var(--text)]">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-bold text-[var(--primary)]">{price}</p>
                  <p className="mt-3 flex-1 text-sm text-[var(--muted)]">{plan.description || ""}</p>
                  <Link
                    href={
                      plan.isCustomPricing
                        ? "/contact"
                        : `${erp}/signup?plan=${encodeURIComponent(plan.slug)}&cycle=MONTHLY`
                    }
                    className="mt-5 text-sm font-semibold text-[var(--primary)] hover:underline"
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
