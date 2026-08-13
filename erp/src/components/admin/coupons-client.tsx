"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TableScroll } from "@/components/ui/table-scroll";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";

type CouponRow = {
  id: string;
  code: string;
  type: string;
  value: number;
  redemptionCount: number;
  maxRedemptions: number | null;
  isActive: boolean;
};

export function AdminCouponsClient({ coupons }: { coupons: CouponRow[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENT");
  const [value, setValue] = useState("10");
  const [message, setMessage] = useState<string | null>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        type,
        value: type === "PERCENT" ? Number(value) : Math.round(Number(value) * 100),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setCode("");
    setMessage("Created");
    router.refresh();
  }

  async function deactivate(id: string) {
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Create coupon</CardTitle>
        <form onSubmit={create} className="mt-4 grid gap-3 sm:grid-cols-4">
          <div>
            <Label>Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="PERCENT">Percent</option>
              <option value="FIXED">Fixed (₹)</option>
            </Select>
          </div>
          <div>
            <Label>Value</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} required />
          </div>
          <div className="flex items-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>}
      </Card>

      <Card>
        <CardTitle>Coupons</CardTitle>
        <TableScroll>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr>
              <th className="py-2">Code</th>
              <th className="py-2">Type</th>
              <th className="py-2">Value</th>
              <th className="py-2">Redeemed</th>
              <th className="py-2">Active</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-[var(--border)]">
                <td className="py-2 font-medium">{c.code}</td>
                <td className="py-2">{c.type}</td>
                <td className="py-2">
                  {c.type === "PERCENT" ? `${c.value}%` : `₹${(c.value / 100).toFixed(0)}`}
                </td>
                <td className="py-2">
                  {c.redemptionCount}
                  {c.maxRedemptions != null ? ` / ${c.maxRedemptions}` : ""}
                </td>
                <td className="py-2">{c.isActive ? "Yes" : "No"}</td>
                <td className="py-2">
                  {c.isActive && (
                    <Button size="sm" variant="secondary" onClick={() => deactivate(c.id)}>
                      Deactivate
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </TableScroll>
      </Card>
    </div>
  );
}
