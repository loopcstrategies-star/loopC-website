import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InviteMemberForm } from "@/components/app/invite-member-form";
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
  const atLimit = userLimit != null && members.length >= userLimit;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-[var(--muted)]">
            People with access to this workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            {members.length}
            {userLimit != null ? ` / ${userLimit}` : ""} users
          </Badge>
          {atLimit && (
            <Link href="/pricing">
              <Button size="sm">Upgrade plan</Button>
            </Link>
          )}
        </div>
      </div>

      <Card>
        <CardTitle>Invite teammate</CardTitle>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Seat limits are enforced on the server for your current plan.
        </p>
        <div className="mt-4">
          <InviteMemberForm
            atLimit={atLimit}
            userLimit={userLimit}
            memberCount={members.length}
          />
        </div>
      </Card>

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
