import Link from "next/link";
import { AccessError } from "@/server/access/errors";
import { assertFeature } from "@/server/access/features";
import { requireAppSession } from "@/lib/session-guards";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeRequired } from "@/components/app/upgrade-required";
import type { ModuleKey } from "@/lib/constants";

export async function ModuleStubPage({
  title,
  moduleKey,
  description,
}: {
  title: string;
  moduleKey: ModuleKey | string;
  description: string;
}) {
  const session = await requireAppSession();
  const companyId = session.user.companyId;

  try {
    await assertFeature(companyId, moduleKey);
  } catch (err) {
    if (err instanceof AccessError && err.code === "FEATURE_DISABLED") {
      return (
        <UpgradeRequired
          companyId={companyId}
          moduleKey={moduleKey}
          title={title}
        />
      );
    }

    const message =
      err instanceof AccessError ? err.message : "This module is not available";
    return (
      <Card className="max-w-xl">
        <CardTitle>{title}</CardTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/billing">
            <Button>Manage billing</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary">View plans</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[var(--muted)]">{description}</p>
      </div>
      <Card>
        <CardTitle>Module ready</CardTitle>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This module is enabled on your plan. Use the workspace tools here as
          workflows roll out.
        </p>
      </Card>
    </div>
  );
}
