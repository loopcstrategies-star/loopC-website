"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";

type Settings = {
  trialEnabled: boolean;
  trialDays: number;
  trialRequiresPayment: boolean;
  gracePeriodDays: number;
  downgradeMode: string;
  retentionDays: number;
  taxPercent: number;
  currency: string;
};

export function AdminSettingsClient({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState<string | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setMessage("Saved");
    router.refresh();
  }

  return (
    <Card className="max-w-xl">
      <CardTitle>Billing settings</CardTitle>
      <form onSubmit={save} className="mt-4 space-y-4">
        <div className="flex items-center gap-2">
          <input
            id="trialEnabled"
            type="checkbox"
            checked={form.trialEnabled}
            onChange={(e) => setForm({ ...form, trialEnabled: e.target.checked })}
          />
          <Label htmlFor="trialEnabled" className="mb-0">
            Trials enabled
          </Label>
        </div>
        <div>
          <Label>Trial days</Label>
          <Input
            type="number"
            value={form.trialDays}
            onChange={(e) => setForm({ ...form, trialDays: Number(e.target.value) })}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="trialRequiresPayment"
            type="checkbox"
            checked={form.trialRequiresPayment}
            onChange={(e) =>
              setForm({ ...form, trialRequiresPayment: e.target.checked })
            }
          />
          <Label htmlFor="trialRequiresPayment" className="mb-0">
            Trial requires payment method
          </Label>
        </div>
        <div>
          <Label>Grace period days</Label>
          <Input
            type="number"
            value={form.gracePeriodDays}
            onChange={(e) =>
              setForm({ ...form, gracePeriodDays: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Downgrade mode</Label>
          <Select
            value={form.downgradeMode}
            onChange={(e) => setForm({ ...form, downgradeMode: e.target.value })}
          >
            <option value="NEXT_CYCLE">Next cycle</option>
            <option value="IMMEDIATE">Immediate</option>
          </Select>
        </div>
        <div>
          <Label>Retention days</Label>
          <Input
            type="number"
            value={form.retentionDays}
            onChange={(e) =>
              setForm({ ...form, retentionDays: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Tax percent</Label>
          <Input
            type="number"
            value={form.taxPercent}
            onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Currency</Label>
          <Input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          />
        </div>
        <Button type="submit">Save settings</Button>
        {message && <p className="text-sm text-[var(--muted)]">{message}</p>}
      </form>
    </Card>
  );
}
