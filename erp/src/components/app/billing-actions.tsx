"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { formatInr } from "@/lib/constants";

type PlanOption = { id: string; name: string; slug: string };

export function BillingActions({
  plans,
  currentPlanId,
}: {
  plans: PlanOption[];
  currentPlanId: string | null;
}) {
  const router = useRouter();
  const [planId, setPlanId] = useState(currentPlanId ?? plans[0]?.id ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function call(path: string, body?: object) {
    setBusy(path);
    setMessage(null);
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setMessage(data.error ?? "Request failed");
      return;
    }
    setMessage(data.message ?? "Done");
    router.refresh();
  }

  return (
    <Card>
      <CardTitle>Actions</CardTitle>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">Change plan</label>
          <Select value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <Button
          disabled={!!busy || !planId}
          onClick={() => call("/api/billing/change-plan", { planId })}
        >
          Upgrade / downgrade
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={!!busy}
          onClick={() => call("/api/billing/cancel", { atPeriodEnd: true })}
        >
          Cancel at period end
        </Button>
        <Button
          variant="danger"
          disabled={!!busy}
          onClick={() => call("/api/billing/cancel", { atPeriodEnd: false })}
        >
          Cancel now
        </Button>
        <Link href="/pricing">
          <Button variant="ghost">Renew / new checkout</Button>
        </Link>
      </div>
      {message && <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>}
    </Card>
  );
}

export function formatMoneyLine(label: string, paise: number | null | undefined) {
  return `${label}: ${formatInr(paise)}`;
}
