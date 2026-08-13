import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUpgradeContext } from "@/server/access/plans";

export async function UpgradeRequired({
  companyId,
  moduleKey,
  title,
}: {
  companyId: string;
  moduleKey: string;
  title?: string;
}) {
  const ctx = await getUpgradeContext({ companyId, moduleKey });

  return (
    <Card className="mx-auto max-w-2xl border-[var(--accent)]/30">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="warning">Upgrade required</Badge>
        {ctx.currentPlan && <Badge>{ctx.currentPlan.name}</Badge>}
      </div>
      <CardTitle className="mt-3">
        {title ?? ctx.moduleLabel} is not on your plan
      </CardTitle>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Your current plan
        {ctx.currentPlan ? (
          <>
            {" "}
            <strong className="text-[var(--ink)]">{ctx.currentPlan.name}</strong>
          </>
        ) : (
          " does not include a subscription"
        )}
        . Unlock <strong className="text-[var(--ink)]">{ctx.moduleLabel}</strong>
        {ctx.requiredPlan ? (
          <>
            {" "}
            by upgrading to{" "}
            <strong className="text-[var(--ink)]">{ctx.requiredPlan.name}</strong>
            .
          </>
        ) : (
          "."
        )}
      </p>

      {ctx.requiredPlan?.description && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          {ctx.requiredPlan.description}
        </p>
      )}

      {ctx.benefits.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Included with {ctx.requiredPlan?.name ?? "the upgrade"}
          </p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {ctx.benefits.slice(0, 8).map((benefit) => (
              <li key={benefit} className="text-sm text-[var(--ink)]">
                · {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={ctx.checkoutHref}>
          <Button>
            Upgrade{ctx.requiredPlan ? ` to ${ctx.requiredPlan.name}` : ""}
          </Button>
        </Link>
        <Link href={ctx.pricingHref}>
          <Button variant="secondary">Compare plans</Button>
        </Link>
        <Link href="/app">
          <Button variant="ghost">Back to dashboard</Button>
        </Link>
      </div>
    </Card>
  );
}
