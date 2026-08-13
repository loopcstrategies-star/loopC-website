import Link from "next/link";
import { AccessError } from "@/server/access/errors";
import { assertFeature } from "@/server/access/features";
import { requireAppSession } from "@/lib/session-guards";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  try {
    await assertFeature(session.user.companyId, moduleKey);
  } catch (err) {
    const message =
      err instanceof AccessError ? err.message : "This module is not available";
    return (
      <Card className="max-w-xl">
        <CardTitle>{title}</CardTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
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
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[var(--muted)]">{description}</p>
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
