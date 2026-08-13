import Link from "next/link";
import { Badge, subscriptionTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { MODULE_CATALOG } from "@/lib/constants";
import { requireAppSession } from "@/lib/session-guards";
import { getCompanySubscription } from "@/server/access/subscription";
import { getEnabledModules } from "@/server/access/features";
import { prisma } from "@/server/db";

export default async function AppDashboardPage() {
  const session = await requireAppSession();
  const companyId = session.user.companyId;

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

  let enabledModules: string[] = [];
  try {
    enabledModules = await getEnabledModules(companyId);
  } catch {
    enabledModules = [];
  }

  const userLimit =
    subscription?.plan.limits.find((l) => l.limitKey === "users")?.value ?? null;
  const enabledSet = new Set(enabledModules);
  const catalogKeys = [
    "accounting",
    "invoicing",
    "inventory",
    "crm",
    "reports",
    "hr",
    "payroll",
    "api",
  ];
  const lockedModules = catalogKeys.filter((key) => {
    if (enabledSet.has(key)) return false;
    if (key === "reports") {
      return !(
        enabledSet.has("reports") ||
        enabledSet.has("reports_basic") ||
        enabledSet.has("reports_advanced")
      );
    }
    return true;
  });

  const needsUpgrade =
    !subscription ||
    subscription.status === "TRIAL" ||
    subscription.plan.slug === "starter" ||
    lockedModules.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-[var(--muted)]">
            {company?.name ?? "Your company"} · LoopC workspace overview
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/billing">
            <Button variant="secondary">Billing</Button>
          </Link>
          {needsUpgrade && (
            <Link href="/pricing">
              <Button>Upgrade plan</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--muted)]">Company</p>
          <p className="mt-2 text-xl font-semibold">{company?.name ?? "—"}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Plan</p>
          <p className="mt-2 text-xl font-semibold">
            {subscription?.plan.name ?? "No plan"}
          </p>
        </Card>
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
          <p className="text-sm text-[var(--muted)]">Renewal</p>
          <p className="mt-2 text-xl font-semibold">
            {formatDate(subscription?.renewalDate) || "—"}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Team usage</CardTitle>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {memberCount}
            {userLimit != null ? (
              <span className="text-lg font-medium text-[var(--muted)]">
                {" "}
                / {userLimit}
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Active members on this company
            {userLimit != null && memberCount >= userLimit
              ? " · Limit reached"
              : ""}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/app/team">
              <Button variant="secondary" size="sm">
                Manage team
              </Button>
            </Link>
            {userLimit != null && memberCount >= userLimit && (
              <Link href="/pricing">
                <Button size="sm">Upgrade for more seats</Button>
              </Link>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Modules</CardTitle>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {enabledModules.length}
            <span className="text-lg font-medium text-[var(--muted)]">
              {" "}
              available
            </span>
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {lockedModules.length} locked on your current plan
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {enabledModules.slice(0, 6).map((key) => (
              <Badge key={key} tone="success">
                {MODULE_CATALOG.find((m) => m.key === key)?.label ?? key}
              </Badge>
            ))}
            {lockedModules.slice(0, 4).map((key) => (
              <Badge key={key} tone="warning">
                {MODULE_CATALOG.find((m) => m.key === key)?.label ?? key} · locked
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Recent invoices</CardTitle>
          <Link href="/app/billing" className="text-sm text-[var(--accent)] hover:underline">
            Billing & invoices
          </Link>
        </div>
        {recentInvoices.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            No billing invoices yet. Complete checkout to activate your
            subscription.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 font-medium">Number</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Total</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-[var(--border)]">
                    <td className="py-2">{inv.number}</td>
                    <td className="py-2">
                      <Badge>{inv.status}</Badge>
                    </td>
                    <td className="py-2">
                      ₹{(inv.totalInr / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2">{formatDate(inv.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(subscription?.status === "TRIAL" ||
        subscription?.status === "PAST_DUE" ||
        !subscription) && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardTitle>
            {!subscription
              ? "Choose a plan to unlock ERP modules"
              : subscription.status === "TRIAL"
                ? "You're on a trial"
                : "Payment past due"}
          </CardTitle>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {!subscription
              ? "Pick a plan and complete checkout. Modules unlock only after a verified subscription."
              : subscription.status === "TRIAL"
                ? `Trial ends ${formatDate(subscription.trialEndDate)}. Upgrade anytime to keep access.`
                : `Grace period ends ${formatDate(subscription.graceEndsAt)}. Update billing to avoid suspension.`}
          </p>
          <div className="mt-4">
            <Link href={subscription ? "/app/billing" : "/pricing"}>
              <Button>
                {subscription?.status === "PAST_DUE"
                  ? "Fix billing"
                  : "View plans"}
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
