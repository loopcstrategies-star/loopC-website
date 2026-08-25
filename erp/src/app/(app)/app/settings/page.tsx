import { Card, CardTitle } from "@/components/ui/card";
import { requireAppSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function SettingsPage() {
  const session = await requireAppSession();
  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-[var(--muted)]">Workspace details</p>
      </div>
      <Card className="max-w-xl">
        <CardTitle>Company</CardTitle>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Name</dt>
            <dd>{company?.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Slug</dt>
            <dd>{company?.slug}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Email</dt>
            <dd>{company?.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Phone</dt>
            <dd>{company?.phone ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Address</dt>
            <dd className="text-right">{company?.address ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Country</dt>
            <dd>{company?.country ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Employees</dt>
            <dd>{company?.employeeCount ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Your email</dt>
            <dd>{session.user.email}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Contact fields are managed by LoopC admin. Ask support if they need updating.
        </p>
      </Card>
    </div>
  );
}
