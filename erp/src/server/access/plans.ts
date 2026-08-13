import { prisma } from "@/server/db";
import { MODULE_CATALOG } from "@/lib/constants";

/** Prefer lowest sortOrder plan that includes the module. */
export async function findMinimumPlanForModule(moduleKey: string) {
  const plans = await prisma.plan.findMany({
    where: {
      isActive: true,
      features: { some: { moduleKey, enabled: true } },
    },
    include: {
      features: { where: { enabled: true } },
      limits: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  return plans[0] ?? null;
}

export function moduleLabel(moduleKey: string): string {
  return MODULE_CATALOG.find((m) => m.key === moduleKey)?.label ?? moduleKey;
}

export async function getUpgradeContext(input: {
  companyId: string;
  moduleKey: string;
}) {
  const [subscription, requiredPlan] = await Promise.all([
    prisma.subscription.findUnique({
      where: { companyId: input.companyId },
      include: {
        plan: { include: { features: true, limits: true } },
      },
    }),
    findMinimumPlanForModule(input.moduleKey),
  ]);

  const currentPlan = subscription?.plan ?? null;
  const benefits =
    requiredPlan?.features
      .filter((f) => f.enabled)
      .map((f) => f.label || moduleLabel(f.moduleKey)) ?? [];

  return {
    moduleKey: input.moduleKey,
    moduleLabel: moduleLabel(input.moduleKey),
    currentPlan: currentPlan
      ? { id: currentPlan.id, slug: currentPlan.slug, name: currentPlan.name }
      : null,
    requiredPlan: requiredPlan
      ? {
          id: requiredPlan.id,
          slug: requiredPlan.slug,
          name: requiredPlan.name,
          description: requiredPlan.description,
        }
      : null,
    benefits,
    checkoutHref: requiredPlan
      ? `/checkout?plan=${encodeURIComponent(requiredPlan.slug)}&cycle=MONTHLY`
      : "/pricing",
    pricingHref: "/pricing",
  };
}
