import Link from "next/link";
import { Badge, subscriptionTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { getExternalErpUrl } from "@/lib/external-erp";
import { requireAppSession } from "@/lib/session-guards";
import { getCompanySubscription, isErpAccessReady } from "@/server/access/subscription";
import { prisma } from "@/server/db";

export default async function AccountPortalPage() {
  const session = await requireAppSession();
  const companyId = session.user.companyId;
  const erpUrl = getExternalErpUrl();

  const [company, subscription, memberCount, recentInvoices] = await Promise.all([
    prisma.company.findUnique({ where: { id: companyId } }),
    getCompanySubscription(companyId),
    prisma.membership.count({ where: { companyId } }),
    prisma.invoice.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const userLimit =
    subscription?.plan.limits.find((l) => l.limitKey === "users")?.value ?? null;
  const accessReady = isErpAccessReady(subscription);
  const canOpenErp = accessReady && Boolean(erpUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
          <p className="mt-1 text-[var(--muted)]">
            Manage your subscription and billing. Open ERP launches the separate product.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canOpenErp ? (
            <a href={erpUrl!} target="_blank" rel="noopener noreferrer">
              <Button>Open ERP</Button>
            </a>
          ) : (
            <Link href="/pricing">
              <Button>Choose a plan</Button>
            </Link>
          )}
          <Link href="/app/billing">
            <Button variant="secondary">Billing</Button>
          </Link>
        </div>
      </div>

      <Card className="border-[var(--accent)]/25 bg-[var(--accent-soft)]/40">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>ERP Access</CardTitle>
          <Badge tone={canOpenErp ? "success" : "neutral"}>
            {canOpenErp ? "Ready" : accessReady ? "URL missing" : "Disabled"}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This portal sells and manages subscriptions. The ERP application itself is a separate
          product.
        </p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--muted)]">Subscription status</dt>
            <dd className="font-medium">{subscription?.status ?? "None"}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Access</dt>
            <dd className="font-medium">
              {accessReady ? "Entitled" : "Not entitled — choose or renew a plan"}
            </dd>
          </div>
        </dl>
        {canOpenErp ? (
          <a
            href={erpUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Open existing ERP →
          </a>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">
            {accessReady
              ? "Subscription is active, but the external ERP URL is not configured."
              : "Activate a subscription to unlock product access."}
          </p>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--muted)]">Company</p>
          <p className="mt-2 text-xl font-semibold">{company?.name ?? "—"}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{company?.email || "—"}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Plan</p>
          <p className="mt-2 text-xl font-semibold">{subscription?.plan.name ?? "No plan"}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Subscription</p>
          <div className="mt-2">
            {subscription ? (
              <Badge tone={subscriptionTone(subscription.status)}>{subscription.status}</Badge>
            ) : (
              <span className="text-xl font-semibold">—</span>
            )}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Team seats</p>
          <p className="mt-2 text-xl font-semibold">
            {memberCount}
            {userLimit != null ? ` / ${userLimit}` : ""}
          </p>
        </Card>
      </div>

      <Card>
        <CardTitle>Company details</CardTitle>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--muted)]">Email</dt>
            <dd className="font-medium">{company?.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Phone</dt>
            <dd className="font-medium">{company?.phone || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[var(--muted)]">Address</dt>
            <dd className="font-medium">{company?.address || "—"}</dd>
          </div>
        </dl>
        <Link href="/app/settings" className="mt-4 inline-flex text-sm text-[var(--accent)] hover:underline">
          Workspace settings →
        </Link>
      </Card>

      {subscription && (
        <Card>
          <CardTitle>Current period</CardTitle>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--muted)]">Cycle</dt>
              <dd className="font-medium">{subscription.billingCycle}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Renews / ends</dt>
              <dd className="font-medium">{formatDate(subscription.renewalDate)}</dd>
            </div>
          </dl>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Recent invoices</CardTitle>
          <Link href="/app/billing" className="text-sm text-[var(--accent)] hover:underline">
            View billing &amp; payments
          </Link>
        </div>
        {recentInvoices.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No invoices yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)] text-sm">
            {recentInvoices.map((inv) => (
              <li key={inv.id} className="flex justify-between gap-3 py-2">
                <span>{inv.number}</span>
                <span className="text-[var(--muted)]">{inv.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
