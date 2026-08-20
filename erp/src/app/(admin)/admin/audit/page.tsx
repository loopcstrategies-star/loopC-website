import { requireAdminSession } from "@/lib/session-guards";
import { formatDate } from "@/lib/format";
import { prisma } from "@/server/db";
import { Card } from "@/components/ui/card";

export default async function AdminAuditPage() {
  await requireAdminSession();

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: { select: { name: true, email: true } },
      company: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit logs</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Recent admin, billing, CMS and website events recorded in the unified application.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
              <tr>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Actor</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Entity</th>
                <th className="px-5 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-[var(--border)] align-top">
                  <td className="px-5 py-3 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                  <td className="px-5 py-3 font-medium text-[var(--ink)]">{log.action}</td>
                  <td className="px-5 py-3 text-[var(--muted)]">
                    {log.actor?.name || "System"}
                    {log.actor?.email ? <div className="text-xs">{log.actor.email}</div> : null}
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)]">
                    {log.company?.name ?? "—"}
                    {log.company?.slug ? <div className="text-xs">{log.company.slug}</div> : null}
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)]">
                    {log.entityType ?? "—"}
                    {log.entityId ? <div className="text-xs break-all">{log.entityId}</div> : null}
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)]">{log.ip ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
