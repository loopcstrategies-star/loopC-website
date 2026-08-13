import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAppSession } from "@/lib/session-guards";
import { getCompanySubscription } from "@/server/access/subscription";
import { prisma } from "@/server/db";

export default async function TeamPage() {
  const session = await requireAppSession();
  const companyId = session.user.companyId;

  const [members, subscription] = await Promise.all([
    prisma.membership.findMany({
      where: { companyId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        role: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    getCompanySubscription(companyId),
  ]);

  const userLimit =
    subscription?.plan.limits.find((l) => l.limitKey === "users")?.value ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-[var(--muted)]">
            People with access to this workspace.
          </p>
        </div>
        <Badge>
          {members.length}
          {userLimit != null ? ` / ${userLimit}` : ""} users
        </Badge>
      </div>

      <Card>
        <CardTitle>Members</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Role</th>
                <th className="py-2 font-medium">Owner</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{m.user.name}</td>
                  <td className="py-2">{m.user.email}</td>
                  <td className="py-2">{m.role.name}</td>
                  <td className="py-2">{m.isOwner ? "Yes" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
