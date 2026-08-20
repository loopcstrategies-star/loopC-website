import { Card, CardTitle } from "@/components/ui/card";
import { PaymentsClient } from "@/components/admin/payments-client";
import { formatInr } from "@/lib/constants";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminPaymentsPage() {
  await requireAdminSession();
  const payments = await prisma.payment.findMany({
    include: {
      company: true,
      subscription: { include: { plan: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const rows = payments.map((p) => ({
    id: p.id,
    companyName: p.company.name,
    planName: p.subscription?.plan.name ?? null,
    amountLabel: formatInr(p.amountInr),
    status: p.status,
    provider: p.provider,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
      <Card>
        <CardTitle>Recent payments</CardTitle>
        <PaymentsClient payments={rows} />
      </Card>
    </div>
  );
}
