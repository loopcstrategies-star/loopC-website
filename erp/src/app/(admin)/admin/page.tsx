import { Card } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/session-guards";
import { formatInr } from "@/lib/constants";
import { prisma } from "@/server/db";
import { BillingCycle, PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { startOfMonth, subDays, subMonths, format } from "date-fns";

function monthKey(d: Date) {
  return format(d, "yyyy-MM");
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return format(date, "MMM yy");
}

function BarChart({
  title,
  rows,
  formatValue,
}: {
  title: string;
  rows: { label: string; value: number }[];
  formatValue?: (n: number) => string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {rows.every((r) => r.value === 0) ? (
        <p className="mt-3 text-sm text-[var(--muted)]">No data yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="text-[var(--muted)]">
                  {formatValue ? formatValue(row.value) : row.value.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[var(--surface-2)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.round((row.value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const now = new Date();
  const monthStart = startOfMonth(now);
  const last30 = subDays(now, 30);
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

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
    paymentsLast6m,
    subscriptionsLast6m,
    companiesLast6m,
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
    prisma.payment.findMany({
      where: {
        status: PaymentStatus.SUCCEEDED,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amountInr: true, createdAt: true },
    }),
    prisma.subscription.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
      },
      select: { createdAt: true },
    }),
    prisma.company.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
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

  const monthKeys: string[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    monthKeys.push(monthKey(startOfMonth(subMonths(now, i))));
  }

  const revenueByMonth = new Map(monthKeys.map((k) => [k, 0]));
  for (const p of paymentsLast6m) {
    const k = monthKey(p.createdAt);
    if (revenueByMonth.has(k)) {
      revenueByMonth.set(k, (revenueByMonth.get(k) ?? 0) + p.amountInr);
    }
  }

  const subsByMonth = new Map(monthKeys.map((k) => [k, 0]));
  for (const s of subscriptionsLast6m) {
    const k = monthKey(s.createdAt);
    if (subsByMonth.has(k)) {
      subsByMonth.set(k, (subsByMonth.get(k) ?? 0) + 1);
    }
  }

  const customersByMonth = new Map(monthKeys.map((k) => [k, 0]));
  for (const c of companiesLast6m) {
    const k = monthKey(c.createdAt);
    if (customersByMonth.has(k)) {
      customersByMonth.set(k, (customersByMonth.get(k) ?? 0) + 1);
    }
  }

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
  const planTotal = planDistribution.reduce((s, [, n]) => s + n, 0) || 1;

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

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart
          title="Monthly revenue (last 6 months)"
          rows={monthKeys.map((k) => ({
            label: monthLabel(k),
            value: revenueByMonth.get(k) ?? 0,
          }))}
          formatValue={(n) => formatInr(n)}
        />
        <BarChart
          title="Subscription growth (new ACTIVE/TRIAL)"
          rows={monthKeys.map((k) => ({
            label: monthLabel(k),
            value: subsByMonth.get(k) ?? 0,
          }))}
        />
        <BarChart
          title="Customer growth (new companies)"
          rows={monthKeys.map((k) => ({
            label: monthLabel(k),
            value: customersByMonth.get(k) ?? 0,
          }))}
        />
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Plan distribution (active)</h2>
          {planDistribution.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">No active subscriptions yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {planDistribution.map(([name, count]) => {
                const pct = Math.round((count / planTotal) * 100);
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{name}</span>
                      <span className="text-[var(--muted)]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[var(--surface-2)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
