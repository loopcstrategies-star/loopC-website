import { AdminPlansClient } from "@/components/admin/plans-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminPlansPage() {
  await requireAdminSession();
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Plans</h1>
      <AdminPlansClient plans={plans} />
    </div>
  );
}
