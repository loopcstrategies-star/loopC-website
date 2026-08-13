import Link from "next/link";
import { AccessError } from "@/server/access/errors";
import { assertFeature } from "@/server/access/features";
import { requireAppSession } from "@/lib/session-guards";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeRequired } from "@/components/app/upgrade-required";
import { InvoicingPanel } from "@/components/app/erp-workspace";
import { prisma } from "@/server/db";

export default async function InvoicingPage() {
  const session = await requireAppSession();
  const companyId = session.user.companyId;

  try {
    await assertFeature(companyId, "invoicing");
  } catch (err) {
    if (err instanceof AccessError && err.code === "FEATURE_DISABLED") {
      return (
        <UpgradeRequired
          companyId={companyId}
          moduleKey="invoicing"
          title="Invoicing"
        />
      );
    }
    return (
      <Card className="max-w-xl">
        <CardTitle>Invoicing</CardTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {err instanceof AccessError ? err.message : "Unavailable"}
        </p>
        <div className="mt-4">
          <Link href="/app/billing">
            <Button>Manage billing</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const [items, parties, invoices] = await Promise.all([
    prisma.catalogItem.findMany({
      where: { companyId, isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.party.findMany({
      where: { companyId, type: "customer", isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.salesInvoice.findMany({
      where: { companyId },
      include: { party: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoicing</h1>
        <p className="mt-1 text-[var(--muted)]">
          Products, services, and customer sales invoices.
        </p>
      </div>
      <InvoicingPanel
        initialItems={items}
        initialParties={parties}
        initialInvoices={invoices}
      />
    </div>
  );
}
