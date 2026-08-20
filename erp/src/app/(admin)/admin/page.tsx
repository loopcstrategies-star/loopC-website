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
  color = "var(--accent)",
}: {
  title: string;
  rows: { label: string; value: number }[];
  formatValue?: (n: number) => string;
  color?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <Card className="rounded-2xl p-5">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
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
              <div className="mt-1 h-2.5 rounded-full bg-[var(--surface-2)]">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${Math.round((row.value / max) * 100)}%`,
                    background: color,
                  }}
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

  const highlightCards = [
    {
      label: "Monthly Revenue",
      value: formatInr(monthlyRevenue),
      tone: "admin-kpi-blue",
      bar: "#2563eb",
    },
    {
      label: "Active Subscriptions",
      value: String(activeSubscriptions),
      tone: "admin-kpi-violet",
      bar: "#7c3aed",
    },
    {
      label: "Customers",
      value: String(companies),
      tone: "admin-kpi-teal",
      bar: "#14b8a6",
    },
    {
      label: "New Enquiries",
      value: String(contactNew),
      tone: "admin-kpi-orange",
      bar: "#f59e0b",
    },
    {
      label: "Yearly Revenue (ARR est.)",
      value: formatInr(arrPaise),
      tone: "admin-kpi-blue",
      bar: "#2563eb",
    },
    {
      label: "Failed Payments (30d)",
      value: String(failedPayments),
      tone: "admin-kpi-orange",
      bar: "#ef4444",
    },
  ];

  const cards = [
    { label: "Customers (users)", value: String(users) },
    { label: "Trial accounts", value: String(trialAccounts) },
    { label: "Past due", value: String(pastDue) },
    { label: "Cancelled", value: String(cancelled) },
    { label: "MRR (estimate)", value: formatInr(mrrPaise) },
    { label: "New companies (30d)", value: String(newCustomers) },
    { label: "Website enquiries", value: String(contactSubmissions) },
    { label: "Published blog posts", value: String(publishedBlogs) },
  ];

  const planDistribution = [...planCounts.entries()].sort((a, b) => b[1] - a[1]);
  const planTotal = planDistribution.reduce((s, [, n]) => s + n, 0) || 1;
  const planColors = ["#2563eb", "#7c3aed", "#14b8a6", "#06b6d4", "#8b5cf6"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Sales, subscriptions and website operations at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {highlightCards.map((c) => (
          <Card key={c.label} className={`rounded-2xl ${c.tone}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--muted)]">{c.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: "var(--kpi, var(--ink))" }}>
                  {c.value}
                </p>
              </div>
              <span
                className="mt-1 h-2.5 w-2.5 rounded-full"
                style={{ background: c.bar }}
                aria-hidden
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-[var(--surface)] p-4 transition hover:bg-[var(--surface-2)]">
              <p className="text-xs text-[var(--muted)]">{c.label}</p>
              <p className="mt-1 text-xl font-semibold">{c.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart
          title="Monthly revenue (last 6 months)"
          color="#2563eb"
          rows={monthKeys.map((k) => ({
            label: monthLabel(k),
            value: revenueByMonth.get(k) ?? 0,
          }))}
          formatValue={(n) => formatInr(n)}
        />
        <BarChart
          title="Subscription growth (new ACTIVE/TRIAL)"
          color="#7c3aed"
          rows={monthKeys.map((k) => ({
            label: monthLabel(k),
            value: subsByMonth.get(k) ?? 0,
          }))}
        />
        <BarChart
          title="Customer growth (new companies)"
          color="#14b8a6"
          rows={monthKeys.map((k) => ({
            label: monthLabel(k),
            value: customersByMonth.get(k) ?? 0,
          }))}
        />
        <Card className="rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Plan distribution (active)</h2>
          {planDistribution.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">No active subscriptions yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {planDistribution.map(([name, count], i) => {
                const pct = Math.round((count / planTotal) * 100);
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{name}</span>
                      <span className="text-[var(--muted)]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2.5 rounded-full bg-[var(--surface-2)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: planColors[i % planColors.length],
                        }}
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
