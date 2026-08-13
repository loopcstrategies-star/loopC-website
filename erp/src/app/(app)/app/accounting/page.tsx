import { AccessError } from "@/server/access/errors";
import { assertFeature } from "@/server/access/features";
import { requireAppSession } from "@/lib/session-guards";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeRequired } from "@/components/app/upgrade-required";
import { CustomersPanel } from "@/components/app/erp-workspace";
import { prisma } from "@/server/db";
import Link from "next/link";

export default async function AccountingPage() {
  const session = await requireAppSession();
  const companyId = session.user.companyId;

  try {
    await assertFeature(companyId, "accounting");
  } catch (err) {
    if (err instanceof AccessError && err.code === "FEATURE_DISABLED") {
      return (
        <UpgradeRequired
          companyId={companyId}
          moduleKey="accounting"
          title="Accounting"
        />
      );
    }
    return (
      <Card className="max-w-xl">
        <CardTitle>Accounting</CardTitle>
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

  const parties = await prisma.party.findMany({
    where: { companyId, type: "customer", isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Accounting</h1>
        <p className="mt-1 text-[var(--muted)]">
          Customers and party records for your company ledger.
        </p>
      </div>
      <CustomersPanel initialParties={parties} />
    </div>
  );
}
