import { Card, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";
import { InvoicesClient } from "@/components/admin/invoices-client";

function formatInr(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default async function AdminInvoicesPage() {
  await requireAdminSession();

  const invoices = await prisma.invoice.findMany({
    include: {
      company: { select: { id: true, name: true, slug: true } },
      subscription: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const rows = invoices.map((inv) => ({
    id: inv.id,
    number: inv.number,
    companyId: inv.companyId,
    companyName: inv.company.name,
    status: inv.status,
    totalInr: inv.totalInr,
    totalLabel: formatInr(inv.totalInr),
    currency: inv.currency,
    paidAt: inv.paidAt?.toISOString() ?? null,
    createdAt: inv.createdAt.toISOString(),
    subscriptionId: inv.subscriptionId ?? null,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
      <Card>
        <CardTitle>All invoices</CardTitle>
        <InvoicesClient invoices={rows} />
      </Card>
    </div>
  );
}
