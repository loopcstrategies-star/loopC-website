import { Card, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminPaymentsPage() {
  await requireAdminSession();
  const payments = await prisma.payment.findMany({
    include: { company: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
      <Card>
        <CardTitle>Recent payments</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2">Company</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Provider</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{p.company.name}</td>
                  <td className="py-2">{formatInr(p.amountInr)}</td>
                  <td className="py-2">{p.status}</td>
                  <td className="py-2">{p.provider}</td>
                  <td className="py-2">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
