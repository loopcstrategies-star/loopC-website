"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <div>
      {/* Billing cycle toggle */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div
          className="inline-flex rounded-full border border-slate-200 bg-white p-1"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              cycle === "monthly" ? "bg-teal-600 text-white shadow" : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setCycle("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              cycle === "yearly" ? "bg-teal-600 text-white shadow" : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setCycle("yearly")}
          >
            Yearly
            <span className="ml-1.5 rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">
              Save ~17%
            </span>
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
              className="lift-card flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-bold text-slate-950">{plan.name}</h3>
              {plan.description ? (
                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              ) : null}

              <div className="mt-4">
                {isEnterprise ? (
                  <p className="text-xl font-bold text-slate-950">Custom pricing</p>
                ) : (
                  <div>
                    <p className="text-3xl font-bold text-teal-800">
                      {priceLabel}
                      <span className="text-base font-normal text-slate-500">{cycleLabel}</span>
                    </p>
                    {cycle === "yearly" && savings > 0 ? (
                      <p className="mt-1 text-xs font-semibold text-teal-600">
                        Save {savings}% vs monthly
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Limits */}
              {plan.limits.length > 0 && (
                <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                  {plan.limits.map((limit) => (
                    <li key={limit.limitKey} className="flex justify-between text-sm">
                      <span className="text-slate-500">{getLimitLabel(limit.limitKey)}</span>
                      <span className="font-semibold text-slate-900">
                        {getLimitDisplay(limit.value, limit.limitKey)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Features */}
              {enabledFeatures.length > 0 && (
                <ul className="mt-4 flex-1 space-y-1.5 border-t border-slate-100 pt-4">
                  {enabledFeatures.map((feature) => (
                    <li key={feature.moduleKey} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="h-4 w-4 shrink-0 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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
                  className={`block w-full rounded-full py-2.5 text-center text-sm font-semibold transition ${
                    isEnterprise
                      ? "border border-slate-200 text-slate-800 hover:border-teal-300 hover:bg-teal-50"
                      : "bg-teal-600 text-white hover:bg-teal-700"
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
