"use client";

import Link from "next/link";
import { useState } from "react";
import type { ErpPlan } from "@/lib/erp-api";
import { formatInrFromPaise } from "@/lib/erp-api";

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
      <div className="flex justify-center">
        <div
          className="inline-flex rounded-full border border-slate-200 bg-white p-1"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              cycle === "monthly" ? "bg-teal-600 text-white" : "text-slate-600"
            }`}
            onClick={() => setCycle("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              cycle === "yearly" ? "bg-teal-600 text-white" : "text-slate-600"
            }`}
            onClick={() => setCycle("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const isEnterprise = plan.isCustomPricing || plan.slug === "enterprise";
          const amount =
            cycle === "yearly" ? plan.yearlyPriceInr : plan.monthlyPriceInr;
          const priceLabel = isEnterprise
            ? "Contact sales"
            : amount == null
              ? "—"
              : `${formatInrFromPaise(amount)}${cycle === "yearly" ? "/yr" : "/mo"}`;

          const href = isEnterprise
            ? "/contact"
            : `${erpBase}/signup?plan=${encodeURIComponent(plan.slug)}`;

          return (
            <article
              key={plan.id || plan.slug}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-950">{plan.name}</h2>
              <p className="mt-3 text-3xl font-bold text-teal-800">{priceLabel}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {plan.description || ""}
              </p>
              {plan.features?.length ? (
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                  {plan.features
                    .filter((f) => f.enabled)
                    .map((f) => (
                      <li key={f.id || f.moduleKey} className="text-sm text-slate-700">
                        {f.label || f.moduleKey}
                      </li>
                    ))}
                </ul>
              ) : null}
              <Link
                href={href}
                className={`mt-6 inline-flex justify-center rounded-full px-4 py-2.5 text-sm font-semibold ${
                  isEnterprise
                    ? "border border-slate-300 text-slate-800"
                    : "bg-teal-600 text-white"
                }`}
              >
                {isEnterprise ? "Contact sales" : "Choose plan"}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
