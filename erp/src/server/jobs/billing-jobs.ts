import "dotenv/config";
import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/audit";

export type BillingJobResult = {
  trialsExpired: number;
  graceSuspended: number;
  downgradesApplied: number;
  periodEndCancellations: number;
};

/**
 * Cron / CLI billing maintenance:
 * - expire trials past trialEndDate
 * - suspend PAST_DUE after graceEndsAt
 * - apply scheduled downgrades at/after renewalDate
 * - finalize period-end cancellations
 */
export async function runBillingJobs(now = new Date()): Promise<BillingJobResult> {
  let trialsExpired = 0;
  let graceSuspended = 0;
  let downgradesApplied = 0;
  let periodEndCancellations = 0;

  const expiredTrials = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.TRIAL,
      trialEndDate: { lte: now },
    },
  });

  for (const sub of expiredTrials) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: SubscriptionStatus.EXPIRED },
    });
    await writeAuditLog({
      companyId: sub.companyId,
      action: "billing.trial_expired",
      entityType: "Subscription",
      entityId: sub.id,
    });
    trialsExpired += 1;
  }

  const pastGrace = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.PAST_DUE,
      graceEndsAt: { lte: now },
    },
  });

  for (const sub of pastGrace) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: SubscriptionStatus.SUSPENDED },
    });
    await writeAuditLog({
      companyId: sub.companyId,
      action: "billing.grace_suspended",
      entityType: "Subscription",
      entityId: sub.id,
    });
    graceSuspended += 1;
  }

  const dueDowngrades = await prisma.subscription.findMany({
    where: {
      scheduledPlanId: { not: null },
      OR: [
        { renewalDate: { lte: now } },
        { renewalDate: null },
      ],
    },
  });

  for (const sub of dueDowngrades) {
    if (!sub.scheduledPlanId) continue;
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        planId: sub.scheduledPlanId,
        scheduledPlanId: null,
      },
    });
    await writeAuditLog({
      companyId: sub.companyId,
      action: "billing.scheduled_downgrade_applied",
      entityType: "Subscription",
      entityId: sub.id,
      metadata: { newPlanId: sub.scheduledPlanId },
    });
    downgradesApplied += 1;
  }

  const periodEndCancels = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
      cancellationDate: { lte: now },
    },
  });

  for (const sub of periodEndCancels) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: SubscriptionStatus.CANCELLED },
    });
    await writeAuditLog({
      companyId: sub.companyId,
      action: "billing.period_end_cancelled",
      entityType: "Subscription",
      entityId: sub.id,
    });
    periodEndCancellations += 1;
  }

  return {
    trialsExpired,
    graceSuspended,
    downgradesApplied,
    periodEndCancellations,
  };
}

async function main() {
  const result = await runBillingJobs();
  console.log(JSON.stringify({ ok: true, result }, null, 2));
}

const isDirectRun =
  typeof process !== "undefined" &&
  process.argv[1] &&
  /billing-jobs\.(ts|js|mjs|cjs)$/.test(process.argv[1].replace(/\\/g, "/"));

if (isDirectRun) {
  main()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
