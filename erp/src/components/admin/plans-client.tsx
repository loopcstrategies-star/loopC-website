"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { formatInr } from "@/lib/constants";

type PlanRow = {
  id: string;
  slug: string;
  name: string;
  monthlyPriceInr: number | null;
  yearlyPriceInr: number | null;
  isActive: boolean;
  isCustomPricing: boolean;
  sortOrder: number;
};

export function AdminPlansClient({ plans }: { plans: PlanRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [monthly, setMonthly] = useState("1999");
  const [yearly, setYearly] = useState("19999");
  const [message, setMessage] = useState<string | null>(null);

  async function createPlan(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        monthlyPriceInr: Math.round(Number(monthly) * 100),
        yearlyPriceInr: Math.round(Number(yearly) * 100),
        sortOrder: plans.length + 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setName("");
    setMessage("Plan created");
    router.refresh();
  }

  async function toggleActive(plan: PlanRow) {
    if (plan.isActive) {
      await fetch(`/api/admin/plans/${plan.id}`, { method: "DELETE" });
    } else {
      await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Create plan</CardTitle>
        <form onSubmit={createPlan} className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="monthly">Monthly ₹</Label>
            <Input id="monthly" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="yearly">Yearly ₹</Label>
            <Input id="yearly" value={yearly} onChange={(e) => setYearly(e.target.value)} />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit">Create</Button>
            {message && <span className="ml-3 text-sm text-[var(--muted)]">{message}</span>}
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle>Plans</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Monthly</th>
                <th className="py-2">Yearly</th>
                <th className="py-2">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.slug}</td>
                  <td className="py-2">
                    {p.isCustomPricing ? "Custom" : formatInr(p.monthlyPriceInr)}
                  </td>
                  <td className="py-2">
                    {p.isCustomPricing ? "Custom" : formatInr(p.yearlyPriceInr)}
                  </td>
                  <td className="py-2">{p.isActive ? "Yes" : "No"}</td>
                  <td className="py-2">
                    <Button size="sm" variant="secondary" onClick={() => toggleActive(p)}>
                      {p.isActive ? "Deactivate" : "Activate"}
                    </Button>
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
