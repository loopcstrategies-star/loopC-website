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
      { moduleKey },
    );
  }
  return true;
}

export async function getLimitUsage(
  companyId: string,
  limitKey: LimitKey | string,
) {
  const subscription = await assertSubscriptionActive(companyId);
  const planLimit = subscription.plan.limits.find((l) => l.limitKey === limitKey);
  const periodKey = currentPeriodKey(limitKey);

  if (limitKey === "users") {
    const used = await prisma.membership.count({ where: { companyId } });
    return {
      used,
      limit: planLimit?.value ?? null,
      periodKey,
      remaining:
        planLimit != null ? Math.max(0, planLimit.value - used) : null,
    };
  }

  const counter = await prisma.usageCounter.findUnique({
    where: {
      companyId_limitKey_periodKey: { companyId, limitKey, periodKey },
    },
  });
  const used = counter?.used ?? 0;
  return {
    used,
    limit: planLimit?.value ?? null,
    periodKey,
    remaining:
      planLimit != null ? Math.max(0, planLimit.value - used) : null,
  };
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
  let used = 0;

  if (limitKey === "users") {
    used = await prisma.membership.count({ where: { companyId } });
  } else {
    const counter = await prisma.usageCounter.findUnique({
      where: {
        companyId_limitKey_periodKey: { companyId, limitKey, periodKey },
      },
    });
    used = counter?.used ?? 0;
  }

  if (used + increment > planLimit.value) {
    throw new AccessError(
      "LIMIT_EXCEEDED",
      `Limit "${limitKey}" exceeded (${used + increment}/${planLimit.value})`,
      { limitKey, used, limit: planLimit.value },
    );
  }

  return { allowed: true as const, used, limit: planLimit.value, periodKey };
}

/**
 * Atomically consume a usage counter after assertWithinLimit.
 * For `users`, membership count is the source of truth — do not increment.
 */
export async function consumeLimit(
  companyId: string,
  limitKey: LimitKey | string,
  increment = 1,
) {
  const check = await assertWithinLimit(companyId, limitKey, increment);
  if (limitKey === "users" || check.limit == null) {
    return check;
  }

  const periodKey = check.periodKey ?? currentPeriodKey(limitKey);
  await prisma.usageCounter.upsert({
    where: {
      companyId_limitKey_periodKey: { companyId, limitKey, periodKey },
    },
    create: { companyId, limitKey, periodKey, used: increment },
    update: { used: { increment } },
  });

  return {
    ...check,
    used: check.used + increment,
  };
}
