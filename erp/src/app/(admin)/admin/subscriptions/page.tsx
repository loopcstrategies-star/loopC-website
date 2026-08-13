import { AdminSubscriptionsClient } from "@/components/admin/subscriptions-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminSubscriptionsPage() {
  await requireAdminSession();
  const [subscriptions, plans] = await Promise.all([
    prisma.subscription.findMany({
      include: { company: true, plan: true },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
    prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
      <AdminSubscriptionsClient
        subscriptions={subscriptions.map((s) => ({
          id: s.id,
          companyId: s.companyId,
          status: s.status,
          billingCycle: s.billingCycle,
          renewalDate: s.renewalDate?.toISOString() ?? null,
          company: { name: s.company.name },
          plan: { id: s.plan.id, name: s.plan.name },
        }))}
        plans={plans}
      />
    </div>
  );
}
