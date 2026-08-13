import { BillingCycle, SubscriptionStatus } from "@prisma/client";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireSuperAdmin();

    const [companies, activeSubscriptions, contactSubmissions, publishedBlogs] =
      await Promise.all([
        prisma.company.count(),
        prisma.subscription.count({
          where: { status: SubscriptionStatus.ACTIVE },
        }),
        prisma.contactSubmission.count(),
        prisma.blogPost.count({ where: { isPublished: true } }),
      ]);

    const activeSubs = await prisma.subscription.findMany({
      where: { status: SubscriptionStatus.ACTIVE },
      include: { plan: true },
    });

    let mrrPaise = 0;
    for (const sub of activeSubs) {
      if (sub.plan.isCustomPricing) continue;
      if (sub.billingCycle === BillingCycle.MONTHLY) {
        mrrPaise += sub.plan.monthlyPriceInr ?? 0;
      } else {
        mrrPaise += Math.round((sub.plan.yearlyPriceInr ?? 0) / 12);
      }
    }

    return jsonOk({
      stats: {
        companies,
        activeSubscriptions,
        contactSubmissions,
        publishedBlogs,
        mrrPaise,
        mrrInr: mrrPaise / 100,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
