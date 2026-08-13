import type { LimitKey, ModuleKey } from "@/lib/constants";
import { prisma } from "@/server/db";
import { AccessError } from "@/server/access/errors";
import { assertSubscriptionActive } from "@/server/access/subscription";

function currentPeriodKey(limitKey: string): string {
  if (limitKey === "invoices_per_month") {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
  return "lifetime";
}

export async function getEnabledModules(companyId: string): Promise<string[]> {
  const subscription = await assertSubscriptionActive(companyId);
  return subscription.plan.features.filter((f) => f.enabled).map((f) => f.moduleKey);
}

export async function assertFeature(companyId: string, moduleKey: ModuleKey | string) {
  const modules = await getEnabledModules(companyId);
  if (!modules.includes(moduleKey)) {
    throw new AccessError(
      "FEATURE_DISABLED",
      `Module "${moduleKey}" is not enabled on the current plan`,
    );
  }
  return true;
}

export async function assertWithinLimit(
  companyId: string,
  limitKey: LimitKey | string,
  increment = 1,
) {
  const subscription = await assertSubscriptionActive(companyId);
  const planLimit = subscription.plan.limits.find((l) => l.limitKey === limitKey);

  if (!planLimit) {
    // No limit configured on plan → treat as unlimited
    return { allowed: true as const, used: 0, limit: null as number | null };
  }

  const periodKey = currentPeriodKey(limitKey);
  const counter = await prisma.usageCounter.findUnique({
    where: {
      companyId_limitKey_periodKey: { companyId, limitKey, periodKey },
    },
  });

  const used = counter?.used ?? 0;
  if (used + increment > planLimit.value) {
    throw new AccessError(
      "LIMIT_EXCEEDED",
      `Limit "${limitKey}" exceeded (${used + increment}/${planLimit.value})`,
    );
  }

  return { allowed: true as const, used, limit: planLimit.value, periodKey };
}
