"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

type SubRow = {
  id: string;
  companyId: string;
  status: string;
  billingCycle: string;
  renewalDate: string | null;
  company: { name: string };
  plan: { id: string; name: string };
};

type PlanOpt = { id: string; name: string };

export function AdminSubscriptionsClient({
  subscriptions,
  plans,
}: {
  subscriptions: SubRow[];
  plans: PlanOpt[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [days, setDays] = useState("14");
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      if (status && s.status !== status) return false;
      if (companyId && !s.companyId.includes(companyId) && !s.company.name.toLowerCase().includes(companyId.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [subscriptions, status, companyId]);

  async function act(body: Record<string, unknown>) {
    setMessage(null);
    const res = await fetch("/api/admin/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setMessage("Updated");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Filters</CardTitle>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Select className="w-full sm:w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["TRIAL", "ACTIVE", "PAST_DUE", "CANCELLED", "EXPIRED", "SUSPENDED"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ),
            )}
          </Select>
          <Input
            className="w-full sm:min-w-[12rem] sm:flex-1"
            placeholder="Company id or name"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          />
          <Select className="w-full sm:w-auto" value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Input
            className="w-full sm:w-24"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Days"
          />
        </div>
        {message && <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>}
      </Card>

      <Card>
        <CardTitle>Subscriptions</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2">Company</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Status</th>
                <th className="py-2">Renewal</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-[var(--border)]">
                  <td className="py-2">
                    <div>{s.company.name}</div>
                    <div className="text-xs text-[var(--muted)]">{s.companyId}</div>
                  </td>
                  <td className="py-2">{s.plan.name}</td>
                  <td className="py-2">{s.status}</td>
                  <td className="py-2">{formatDate(s.renewalDate)}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          act({
                            action: "activate",
                            companyId: s.companyId,
                            planId: planId || s.plan.id,
                          })
                        }
                      >
                        Activate
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          act({ action: "suspend", companyId: s.companyId })
                        }
                      >
                        Suspend
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          act({
                            action: "extend",
                            companyId: s.companyId,
                            days: Number(days) || 7,
                          })
                        }
                      >
                        Extend
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          act({
                            action: "trial",
                            companyId: s.companyId,
                            planId: planId || s.plan.id,
                            days: Number(days) || 14,
                          })
                        }
                      >
                        Trial
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
