"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ErpPlan } from "@/lib/erp-api";
import { formatInrFromPaise } from "@/lib/erp-api";

function getLimitLabel(key: string): string {
  const map: Record<string, string> = {
    users: "Users",
    branches: "Branches",
    storage: "Storage (GB)",
    invoices: "Invoices/mo",
  };
  return map[key] ?? key;
}

function getLimitDisplay(value: number, key: string): string {
  if (value >= 9999) return "Unlimited";
  if (key === "storage") return `${value} GB`;
  return String(value);
}

export function PricingPlans({
  plans,
  erpBase,
}: {
  plans: ErpPlan[];
  erpBase: string;
}) {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  const maxSavings = useMemo(() => {
    let max = 0;
    for (const plan of plans) {
      if (plan.isCustomPricing || !plan.monthlyPriceInr || !plan.yearlyPriceInr) continue;
      const savings = Math.round(
        ((plan.monthlyPriceInr * 12 - plan.yearlyPriceInr) / (plan.monthlyPriceInr * 12)) * 100,
      );
      if (savings > max) max = savings;
    }
    return max;
  }, [plans]);

  return (
    <div>
      <div className="mb-10 flex flex-col items-center gap-3">
        <div
          className="inline-flex rounded-xl border border-[var(--border)] bg-white p-1 shadow-sm"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              cycle === "monthly"
                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setCycle("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              cycle === "yearly"
                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setCycle("yearly")}
          >
            Yearly
            {maxSavings > 0 ? (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-inherit">
                Save up to {maxSavings}%
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isEnterprise = plan.isCustomPricing || plan.slug === "enterprise";
          const monthlyAmount = plan.monthlyPriceInr;
          const yearlyAmount = plan.yearlyPriceInr;

          const displayAmount = cycle === "yearly" ? yearlyAmount : monthlyAmount;
          const priceLabel = isEnterprise
            ? "Contact sales"
            : displayAmount == null
              ? "—"
              : `${formatInrFromPaise(displayAmount)}`;

          const cycleLabel = cycle === "yearly" ? "/yr" : "/mo";

          const savings =
            !isEnterprise && monthlyAmount && yearlyAmount
              ? Math.round(((monthlyAmount * 12 - yearlyAmount) / (monthlyAmount * 12)) * 100)
              : 0;

          const billingCycle = cycle === "yearly" ? "YEARLY" : "MONTHLY";
          const href = isEnterprise
            ? "/contact?service=erp"
            : `${erpBase}/signup?plan=${encodeURIComponent(plan.slug)}&cycle=${billingCycle}`;

          const enabledFeatures = plan.features.filter((f) => f.enabled);

          return (
            <div
              key={plan.slug}
              className={`lift-card relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                plan.isPopular
                  ? "border-transparent bg-gradient-to-b from-blue-50/80 to-violet-50/80 shadow-xl shadow-blue-500/15 ring-2 ring-blue-500/35"
                  : "border-[var(--border)]"
              }`}
            >
              {plan.isPopular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Popular
                </span>
              ) : null}
              <h3 className="font-bold text-[var(--text)]">{plan.name}</h3>
              {plan.description ? (
                <p className="mt-1 text-sm text-[var(--muted)]">{plan.description}</p>
              ) : null}

              <div className="mt-4">
                {isEnterprise ? (
                  <p className="text-xl font-bold text-[var(--text)]">Custom pricing</p>
                ) : (
                  <div>
                    <p className="text-3xl font-bold text-[var(--primary)]">
                      {priceLabel}
                      <span className="text-base font-normal text-[var(--muted)]">{cycleLabel}</span>
                    </p>
                    {cycle === "yearly" && savings > 0 ? (
                      <p className="mt-1 text-xs font-semibold text-[var(--secondary)]">
                        Save {savings}% vs monthly
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              {plan.limits.length > 0 && (
                <ul className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-4">
                  {plan.limits.map((limit) => (
                    <li key={limit.limitKey} className="flex justify-between text-sm">
                      <span className="text-[var(--muted)]">{getLimitLabel(limit.limitKey)}</span>
                      <span className="font-semibold text-[var(--text)]">
                        {getLimitDisplay(limit.value, limit.limitKey)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {enabledFeatures.length > 0 && (
                <ul className="mt-4 flex-1 space-y-1.5 border-t border-[var(--border)] pt-4">
                  {enabledFeatures.map((feature) => (
                    <li
                      key={feature.moduleKey}
                      className="flex items-center gap-2 text-sm text-[var(--muted)]"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 text-[var(--primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {feature.label ?? feature.moduleKey}
                    </li>
                  ))}
                </ul>
              )}
              {!enabledFeatures.length && <div className="flex-1" />}

              <div className="mt-6">
                <Link
                  href={href}
                  className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                    isEnterprise
                      ? "border border-[var(--border)] text-[var(--text)] hover:border-blue-300 hover:bg-blue-50"
                      : "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:brightness-105"
                  }`}
                >
                  {isEnterprise ? "Contact sales" : "Choose plan"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
