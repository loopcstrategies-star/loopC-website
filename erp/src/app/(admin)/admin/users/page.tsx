import { Card, CardTitle } from "@/components/ui/card";
import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminUsersPage() {
  await requireAdminSession();

  const users = await prisma.user.findMany({
    orderBy: [{ isSuperAdmin: "desc" }, { createdAt: "desc" }],
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      isSuperAdmin: true,
      createdAt: true,
      memberships: {
        take: 1,
        include: { company: { select: { name: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Users</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Super admins can access /admin. Promote carefully.
        </p>
      </div>
      <Card>
        <CardTitle>Users</CardTitle>
        <div className="mt-4">
          <AdminUsersClient
            users={users.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              isSuperAdmin: u.isSuperAdmin,
              createdAt: u.createdAt.toISOString(),
              companyName: u.memberships[0]?.company.name ?? null,
            }))}
          />
        </div>
      </Card>
    </div>
  );
}
