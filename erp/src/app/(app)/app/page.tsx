import Link from "next/link";
import { Badge, subscriptionTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { requireAppSession } from "@/lib/session-guards";
import { getCompanySubscription } from "@/server/access/subscription";
import { prisma } from "@/server/db";

export default async function AppDashboardPage() {
  const session = await requireAppSession();
  const companyId = session.user.companyId;
  const [company, subscription, memberCount, invoiceCount] = await Promise.all([
    prisma.company.findUnique({ where: { id: companyId } }),
    getCompanySubscription(companyId),
    prisma.membership.count({ where: { companyId } }),
    prisma.invoice.count({ where: { companyId } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[var(--muted)]">
          Overview for {company?.name ?? "your company"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--muted)]">Subscription</p>
          <div className="mt-2">
            {subscription ? (
              <Badge tone={subscriptionTone(subscription.status)}>
                {subscription.status}
              </Badge>
            ) : (
              <Badge>None</Badge>
            )}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Plan</p>
          <p className="mt-2 text-xl font-semibold">
            {subscription?.plan.name ?? "—"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Team members</p>
          <p className="mt-2 text-xl font-semibold">{memberCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Invoices</p>
          <p className="mt-2 text-xl font-semibold">{invoiceCount}</p>
        </Card>
      </div>

      <Card>
        <CardTitle>Next steps</CardTitle>
        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          <li>
            Renewal: {formatDate(subscription?.renewalDate)}
            {subscription?.trialEndDate
              ? ` · Trial ends ${formatDate(subscription.trialEndDate)}`
              : ""}
          </li>
          {!subscription && (
            <li>
              No active subscription —{" "}
              <Link href="/pricing" className="text-[var(--accent)] hover:underline">
                choose a plan
              </Link>
            </li>
          )}
        </ul>
        <div className="mt-4">
          <Link href="/app/billing">
            <Button variant="secondary">Manage billing</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
