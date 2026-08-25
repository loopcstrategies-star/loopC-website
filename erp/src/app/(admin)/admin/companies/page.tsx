import { Card, CardTitle } from "@/components/ui/card";
import { CompaniesClient } from "@/components/admin/companies-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminCompaniesPage() {
  await requireAdminSession();
  const companies = await prisma.company.findMany({
    include: {
      subscription: { include: { plan: true } },
      _count: { select: { memberships: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
      <Card>
        <CardTitle>All companies</CardTitle>
        <div className="mt-4">
          <CompaniesClient
            companies={companies.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              email: c.email ?? null,
              phone: c.phone ?? null,
              address: c.address ?? null,
              status: c.status,
              createdAt: c.createdAt,
              memberships: c._count.memberships,
              planName: c.subscription?.plan.name ?? null,
              subscriptionStatus: c.subscription?.status ?? null,
              planId: c.subscription?.planId ?? null,
              externalErpCustomerId: c.externalErpCustomerId ?? null,
            }))}
          />
        </div>
      </Card>
    </div>
  );
}
