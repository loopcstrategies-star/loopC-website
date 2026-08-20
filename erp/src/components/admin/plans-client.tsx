"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { LIMIT_KEYS, MODULE_CATALOG, formatInr, slugify } from "@/lib/constants";

type FeatureRow = { moduleKey: string; enabled: boolean; label: string | null };
type LimitRow = { limitKey: string; value: number };

export type PlanRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthlyPriceInr: number | null;
  yearlyPriceInr: number | null;
  isActive: boolean;
  isCustomPricing: boolean;
  isPopular: boolean;
  sortOrder: number;
  supportLevel: string;
  trialEligible: boolean;
  features: FeatureRow[];
  limits: LimitRow[];
};

type FormState = {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  monthlyRupees: string;
  yearlyRupees: string;
  isCustomPricing: boolean;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: string;
  supportLevel: string;
  trialEligible: boolean;
  featureKeys: string[];
  limits: Record<string, string>;
};

const emptyLimits = () =>
  Object.fromEntries(LIMIT_KEYS.map((k) => [k, ""])) as Record<string, string>;

function blankForm(sortOrder: number): FormState {
  return {
    id: null,
    name: "",
    slug: "",
    description: "",
    monthlyRupees: "1999",
    yearlyRupees: "19999",
    isCustomPricing: false,
    isPopular: false,
    isActive: true,
    sortOrder: String(sortOrder),
    supportLevel: "email",
    trialEligible: true,
    featureKeys: ["accounting", "invoicing"],
    limits: { ...emptyLimits(), users: "5", branches: "1", storage_gb: "10", invoices_per_month: "100" },
  };
}

function fromPlan(plan: PlanRow): FormState {
  const limits = emptyLimits();
  for (const l of plan.limits) {
    limits[l.limitKey] = String(l.value);
  }
  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    description: plan.description ?? "",
    monthlyRupees:
      plan.monthlyPriceInr == null ? "" : String(Math.round(plan.monthlyPriceInr / 100)),
    yearlyRupees:
      plan.yearlyPriceInr == null ? "" : String(Math.round(plan.yearlyPriceInr / 100)),
    isCustomPricing: plan.isCustomPricing,
    isPopular: plan.isPopular,
    isActive: plan.isActive,
    sortOrder: String(plan.sortOrder),
    supportLevel: plan.supportLevel,
    trialEligible: plan.trialEligible,
    featureKeys: plan.features.filter((f) => f.enabled).map((f) => f.moduleKey),
    limits,
  };
}

function buildPayload(form: FormState) {
  const features = form.featureKeys.map((moduleKey) => ({
    moduleKey,
    enabled: true,
    label: MODULE_CATALOG.find((m) => m.key === moduleKey)?.label,
  }));
  const limits = LIMIT_KEYS.filter((k) => form.limits[k]?.trim())
    .map((limitKey) => ({
      limitKey,
      value: Math.round(Number(form.limits[limitKey])),
    }))
    .filter((l) => Number.isFinite(l.value));

  return {
    name: form.name.trim(),
    slug: (form.slug.trim() || slugify(form.name)).trim(),
    description: form.description.trim() || undefined,
    monthlyPriceInr: form.isCustomPricing
      ? null
      : Math.round(Number(form.monthlyRupees || 0) * 100),
    yearlyPriceInr: form.isCustomPricing
      ? null
      : Math.round(Number(form.yearlyRupees || 0) * 100),
    isCustomPricing: form.isCustomPricing,
    isPopular: form.isPopular,
    isActive: form.isActive,
    sortOrder: Math.round(Number(form.sortOrder) || 0),
    supportLevel: form.supportLevel,
    trialEligible: form.trialEligible,
    features,
    limits,
  };
}

export function AdminPlansClient({
  plans,
  currency = "INR",
}: {
  plans: PlanRow[];
  currency?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => blankForm(plans.length + 1));
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const editing = Boolean(form.id);
  const catalogKeys = useMemo(() => MODULE_CATALOG.map((m) => m.key), []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFeature(key: string) {
    setForm((prev) => ({
      ...prev,
      featureKeys: prev.featureKeys.includes(key)
        ? prev.featureKeys.filter((k) => k !== key)
        : [...prev.featureKeys, key],
    }));
  }

  async function savePlan(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const payload = buildPayload(form);
      const res = await fetch(editing ? `/api/admin/plans/${form.id}` : "/api/admin/plans", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Failed to save plan");
        return;
      }
      setMessage(editing ? "Plan updated" : "Plan created");
      setForm(blankForm(plans.length + 1));
      router.refresh();
    } finally {
      setBusy(false);
    }
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
        <CardTitle>{editing ? "Edit plan" : "Create plan"}</CardTitle>
        <p className="mt-1 text-sm text-[var(--muted)]">Currency: {currency} (paise stored as ×100)</p>
        <form onSubmit={savePlan} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name,
                  slug: prev.id ? prev.slug : slugify(name),
                }));
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sortOrder">Display order</Label>
            <Input
              id="sortOrder"
              value={form.sortOrder}
              onChange={(e) => setField("sortOrder", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="monthly">Monthly ₹</Label>
            <Input
              id="monthly"
              value={form.monthlyRupees}
              onChange={(e) => setField("monthlyRupees", e.target.value)}
              disabled={form.isCustomPricing}
            />
          </div>
          <div>
            <Label htmlFor="yearly">Yearly ₹</Label>
            <Input
              id="yearly"
              value={form.yearlyRupees}
              onChange={(e) => setField("yearlyRupees", e.target.value)}
              disabled={form.isCustomPricing}
            />
          </div>
          <div>
            <Label htmlFor="support">Support level</Label>
            <Input
              id="support"
              value={form.supportLevel}
              onChange={(e) => setField("supportLevel", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-end gap-4 pb-1 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isCustomPricing}
                onChange={(e) => setField("isCustomPricing", e.target.checked)}
              />
              Custom pricing
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setField("isPopular", e.target.checked)}
              />
              Popular
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.trialEligible}
                onChange={(e) => setField("trialEligible", e.target.checked)}
              />
              Trial eligible
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
              />
              Active
            </label>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <p className="mb-2 text-sm font-medium">Features</p>
            <div className="flex flex-wrap gap-2">
              {catalogKeys.map((key) => {
                const label = MODULE_CATALOG.find((m) => m.key === key)?.label ?? key;
                const on = form.featureKeys.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFeature(key)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      on
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <p className="mb-2 text-sm font-medium">Limits</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {LIMIT_KEYS.map((key) => (
                <div key={key}>
                  <Label htmlFor={`limit-${key}`}>{key}</Label>
                  <Input
                    id={`limit-${key}`}
                    value={form.limits[key] ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        limits: { ...prev.limits, [key]: e.target.value },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-4">
            <Button type="submit" disabled={busy}>
              {editing ? "Save changes" : "Create plan"}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm(blankForm(plans.length + 1))}
              >
                Cancel edit
              </Button>
            )}
            {message && <span className="text-sm text-[var(--muted)]">{message}</span>}
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
                <th className="py-2">Order</th>
                <th className="py-2">Monthly</th>
                <th className="py-2">Yearly</th>
                <th className="py-2">Features</th>
                <th className="py-2">Flags</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="py-2">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-[var(--muted)]">{p.slug}</p>
                  </td>
                  <td className="py-2">{p.sortOrder}</td>
                  <td className="py-2">
                    {p.isCustomPricing ? "Custom" : formatInr(p.monthlyPriceInr)}
                  </td>
                  <td className="py-2">
                    {p.isCustomPricing ? "Custom" : formatInr(p.yearlyPriceInr)}
                  </td>
                  <td className="py-2 text-xs text-[var(--muted)]">
                    {p.features.filter((f) => f.enabled).length} modules · {p.limits.length} limits
                  </td>
                  <td className="py-2 text-xs">
                    {p.isPopular && <span className="mr-1 text-[var(--accent)]">Popular</span>}
                    {p.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setForm(fromPlan(p))}>
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => void toggleActive(p)}>
                        {p.isActive ? "Deactivate" : "Activate"}
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
