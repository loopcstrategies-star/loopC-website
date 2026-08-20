import { Card, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

function formatInr(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default async function AdminAnalyticsPage() {
  await requireAdminSession();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalCompanies,
    activeSubscriptions,
    trialSubscriptions,
    cancelledSubscriptions,
    newEnquiriesThisMonth,
    totalEnquiries,
    paymentsThisMonth,
    paymentsLastMonth,
    planCounts,
    recentEnquiries,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "TRIAL" } }),
    prisma.subscription.count({ where: { status: "CANCELLED" } }),
    prisma.contactSubmission.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.contactSubmission.count(),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: startOfMonth } },
      _sum: { amountInr: true },
    }),
    prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { amountInr: true },
    }),
    prisma.subscription.groupBy({
      by: ["planId"],
      _count: { planId: true },
      orderBy: { _count: { planId: "desc" } },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        service: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const planIds = planCounts.map((p) => p.planId);
  const plans = await prisma.plan.findMany({
    where: { id: { in: planIds } },
    select: { id: true, name: true },
  });
  const planMap = Object.fromEntries(plans.map((p) => [p.id, p.name]));

  const mrr = paymentsThisMonth._sum.amountInr ?? 0;
  const lastMrr = paymentsLastMonth._sum.amountInr ?? 0;
  const mrrGrowth = lastMrr > 0 ? Math.round(((mrr - lastMrr) / lastMrr) * 100) : null;

  const stats = [
    { label: "Total customers", value: totalCompanies.toLocaleString("en-IN") },
    { label: "Active subscriptions", value: activeSubscriptions.toLocaleString("en-IN") },
    { label: "Trial subscriptions", value: trialSubscriptions.toLocaleString("en-IN") },
    { label: "Cancelled", value: cancelledSubscriptions.toLocaleString("en-IN") },
    {
      label: "Revenue this month",
      value: formatInr(mrr),
      sub: mrrGrowth !== null ? `${mrrGrowth >= 0 ? "+" : ""}${mrrGrowth}% vs last month` : undefined,
    },
    { label: "Enquiries this month", value: newEnquiriesThisMonth.toLocaleString("en-IN") },
    { label: "Total enquiries", value: totalEnquiries.toLocaleString("en-IN") },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{stat.value}</p>
            {stat.sub && <p className="mt-0.5 text-xs text-[var(--accent)]">{stat.sub}</p>}
          </Card>
        ))}
      </div>

      {/* Plan distribution */}
      <Card className="p-4">
        <CardTitle>Plan distribution</CardTitle>
        <div className="mt-4 space-y-3">
          {planCounts.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No active subscriptions yet.</p>
          ) : (
            planCounts.map((pc) => {
              const planName = planMap[pc.planId] ?? pc.planId;
              const count = pc._count.planId;
              const total = activeSubscriptions + trialSubscriptions;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={pc.planId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{planName}</span>
                    <span className="text-[var(--muted)]">{count} ({pct}%)</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-[var(--surface-2)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Recent enquiries */}
      <Card className="p-4">
        <CardTitle>Recent enquiries</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                {["Name", "Email", "Service", "Status", "Date"].map((h) => (
                  <th key={h} className="pb-2 text-left font-semibold text-[var(--muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentEnquiries.map((e) => (
                <tr key={e.id} className="hover:bg-[var(--surface-2)]">
                  <td className="py-2 pr-4 font-medium">{e.name}</td>
                  <td className="py-2 pr-4 text-[var(--muted)]">{e.email}</td>
                  <td className="py-2 pr-4">{e.service ?? "—"}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs font-semibold">
                      {e.status}
                    </span>
                  </td>
                  <td className="py-2 text-[var(--muted)]">
                    {e.createdAt.toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
