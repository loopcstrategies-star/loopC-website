import Link from "next/link";
import { Badge, subscriptionTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { BillingActions } from "@/components/app/billing-actions";
import { formatInr } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { requireAppSession } from "@/lib/session-guards";
import { getCompanySubscription } from "@/server/access/subscription";
import { prisma } from "@/server/db";

export default async function BillingPage() {
  const session = await requireAppSession();
  const companyId = session.user.companyId;

  const [subscription, invoices, plans] = await Promise.all([
    getCompanySubscription(companyId),
    prisma.invoice.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.plan.findMany({
      where: { isActive: true, isCustomPricing: false },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const price =
    subscription?.billingCycle === "YEARLY"
      ? subscription.plan.yearlyPriceInr
      : subscription?.plan.monthlyPriceInr;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-[var(--muted)]">
          Manage your plan, invoices and renewals.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Current plan</CardTitle>
          {subscription ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Plan</dt>
                <dd className="font-medium">{subscription.plan.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Status</dt>
                <dd>
                  <Badge tone={subscriptionTone(subscription.status)}>
                    {subscription.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Amount</dt>
                <dd>{formatInr(price)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Cycle</dt>
                <dd>{subscription.billingCycle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Next bill</dt>
                <dd>{formatDate(subscription.renewalDate)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">
              No subscription yet.{" "}
              <Link href="/pricing" className="text-[var(--accent)] hover:underline">
                Choose a plan
              </Link>
            </p>
          )}
        </Card>

        <BillingActions
          plans={plans}
          currentPlanId={subscription?.planId ?? null}
        />
      </div>

      <Card>
        <CardTitle>Invoices</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2 font-medium">Number</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Total</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">PDF</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{inv.number}</td>
                  <td className="py-2">{inv.status}</td>
                  <td className="py-2">{formatInr(inv.totalInr)}</td>
                  <td className="py-2">{formatDate(inv.createdAt)}</td>
                  <td className="py-2">
                    <a
                      className="text-[var(--accent)] hover:underline"
                      href={`/api/billing/invoices/${inv.id}/pdf`}
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-[var(--muted)]">
                    No invoices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
