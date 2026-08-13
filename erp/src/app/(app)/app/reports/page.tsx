import Link from "next/link";
import { requireAppSession } from "@/lib/session-guards";
import { assertFeature } from "@/server/access/features";
import { AccessError } from "@/server/access/errors";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ReportsPage() {
  const session = await requireAppSession();
  const keys = ["reports", "reports_basic", "reports_advanced"] as const;

  let allowedKey: string | null = null;
  let lastError: string | null = null;
  for (const key of keys) {
    try {
      await assertFeature(session.user.companyId, key);
      allowedKey = key;
      break;
    } catch (err) {
      lastError = err instanceof AccessError ? err.message : "Not available";
    }
  }

  if (!allowedKey) {
    return (
      <Card className="max-w-xl">
        <CardTitle>Reports</CardTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">{lastError}</p>
        <div className="mt-4">
          <Link href="/pricing">
            <Button>Upgrade plan</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-[var(--muted)]">
          Operational and financial reporting ({allowedKey}).
        </p>
      </div>
      <Card>
        <CardTitle>Coming soon</CardTitle>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This module is enabled on your plan. Full workflows will land here.
        </p>
      </Card>
    </div>
  );
}
