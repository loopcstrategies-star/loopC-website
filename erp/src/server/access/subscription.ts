import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import { AccessError } from "@/server/access/errors";

export { AccessError } from "@/server/access/errors";

export async function getCompanySubscription(companyId: string) {
  return prisma.subscription.findUnique({
    where: { companyId },
    include: {
      plan: {
        include: {
          features: true,
          limits: true,
        },
      },
      scheduledPlan: true,
      coupon: true,
      items: true,
    },
  });
}

/**
 * Allows TRIAL | ACTIVE.
 * PAST_DUE is allowed only while graceEndsAt is still in the future.
 */
export async function assertSubscriptionActive(companyId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    throw new AccessError("COMPANY_MISSING", "Company not found");
  }
  if (company.status === "suspended") {
    throw new AccessError("COMPANY_SUSPENDED", "This company account is suspended");
  }
  if (company.status === "archived") {
    throw new AccessError("COMPANY_ARCHIVED", "This company account is archived");
  }

  const subscription = await getCompanySubscription(companyId);

  if (!subscription) {
    throw new AccessError("SUBSCRIPTION_MISSING", "No subscription found for this company");
  }

  const now = new Date();

  if (
    subscription.status === SubscriptionStatus.TRIAL ||
    subscription.status === SubscriptionStatus.ACTIVE
  ) {
    if (
      subscription.status === SubscriptionStatus.TRIAL &&
      subscription.trialEndDate &&
      subscription.trialEndDate < now
    ) {
      throw new AccessError("TRIAL_EXPIRED", "Trial period has ended");
    }
    return subscription;
  }

  if (subscription.status === SubscriptionStatus.PAST_DUE) {
    if (subscription.graceEndsAt && subscription.graceEndsAt > now) {
      return subscription;
    }
    throw new AccessError("GRACE_EXPIRED", "Payment grace period has ended");
  }

  throw new AccessError(
    "SUBSCRIPTION_INACTIVE",
    `Subscription is ${subscription.status.toLowerCase()}`,
  );
}
