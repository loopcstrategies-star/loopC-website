import { Card } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/session-guards";
import { formatInr } from "@/lib/constants";
import { prisma } from "@/server/db";
import { BillingCycle, PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { startOfMonth, subDays } from "date-fns";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const now = new Date();
  const monthStart = startOfMonth(now);
  const last30 = subDays(now, 30);

  const [
    companies,
    users,
    activeSubscriptions,
    trialAccounts,
    pastDue,
    cancelled,
    contactSubmissions,
    contactNew,
    publishedBlogs,
    failedPayments,
    succeededThisMonth,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.user.count({ where: { isSuperAdmin: false } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.TRIAL } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.PAST_DUE } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.CANCELLED } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "new" } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.payment.count({
      where: { status: PaymentStatus.FAILED, createdAt: { gte: last30 } },
    }),
    prisma.payment.findMany({
      where: {
        status: PaymentStatus.SUCCEEDED,
        createdAt: { gte: monthStart },
      },
      select: { amountInr: true },
    }),
  ]);

  const activeSubs = await prisma.subscription.findMany({
    where: { status: SubscriptionStatus.ACTIVE },
    include: { plan: true },
  });

  let mrrPaise = 0;
  const planCounts = new Map<string, number>();
  for (const sub of activeSubs) {
    planCounts.set(sub.plan.name, (planCounts.get(sub.plan.name) ?? 0) + 1);
    if (sub.plan.isCustomPricing) continue;
    if (sub.billingCycle === BillingCycle.MONTHLY) {
      mrrPaise += sub.plan.monthlyPriceInr ?? 0;
    } else {
      mrrPaise += Math.round((sub.plan.yearlyPriceInr ?? 0) / 12);
    }
  }

  const monthlyRevenue = succeededThisMonth.reduce((sum, p) => sum + p.amountInr, 0);
  const arrPaise = mrrPaise * 12;
  const newCustomers = await prisma.company.count({
    where: { createdAt: { gte: last30 } },
  });

  const cards = [
    { label: "Customers (users)", value: String(users) },
    { label: "Companies", value: String(companies) },
    { label: "Active subscriptions", value: String(activeSubscriptions) },
    { label: "Trial accounts", value: String(trialAccounts) },
    { label: "Past due", value: String(pastDue) },
    { label: "Cancelled", value: String(cancelled) },
    { label: "MRR (estimate)", value: formatInr(mrrPaise) },
    { label: "ARR (estimate)", value: formatInr(arrPaise) },
    { label: "Revenue this month", value: formatInr(monthlyRevenue) },
    { label: "New companies (30d)", value: String(newCustomers) },
    { label: "Failed payments (30d)", value: String(failedPayments) },
    { label: "Website enquiries", value: String(contactSubmissions) },
    { label: "New contact leads", value: String(contactNew) },
    { label: "Published blog posts", value: String(publishedBlogs) },
  ];

  const planDistribution = [...planCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <p className="text-sm text-[var(--muted)]">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold">{c.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Plan distribution (active)</h2>
        {planDistribution.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No active subscriptions yet.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {planDistribution.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between border-b border-[var(--border)] py-2">
                <span>{name}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
