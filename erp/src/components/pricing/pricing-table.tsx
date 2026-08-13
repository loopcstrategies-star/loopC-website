"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/constants";

export type PricingPlan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthlyPriceInr: number | null;
  yearlyPriceInr: number | null;
  isCustomPricing: boolean;
  supportLevel: string;
  features: { moduleKey: string; label: string | null }[];
  limits: { limitKey: string; value: number }[];
};

export function PricingTable({ plans }: { plans: PricingPlan[] }) {
  const [cycle, setCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCycle("MONTHLY")}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            cycle === "MONTHLY"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setCycle("YEARLY")}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            cycle === "YEARLY"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
          }`}
        >
          Yearly
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const price = plan.isCustomPricing
            ? null
            : cycle === "YEARLY"
              ? plan.yearlyPriceInr
              : plan.monthlyPriceInr;

          return (
            <div
              key={plan.id}
              className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm text-[var(--muted)]">
                {plan.description}
              </p>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {plan.isCustomPricing ? "Custom" : formatInr(price)}
                {!plan.isCustomPricing && (
                  <span className="text-sm font-normal text-[var(--muted)]">
                    /{cycle === "YEARLY" ? "yr" : "mo"}
                  </span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-[var(--muted)]">
                {plan.features.slice(0, 6).map((f) => (
                  <li key={f.moduleKey}>• {f.label ?? f.moduleKey}</li>
                ))}
                {plan.limits
                  .filter((l) => l.limitKey === "users")
                  .map((l) => (
                    <li key={l.limitKey}>• Up to {l.value} users</li>
                  ))}
              </ul>
              <div className="mt-6">
                {plan.isCustomPricing ? (
                  <a href="mailto:sales@loopcstrategies.com">
                    <Button className="w-full" variant="secondary">
                      Contact Sales
                    </Button>
                  </a>
                ) : (
                  <Link href={`/signup?plan=${plan.slug}&cycle=${cycle}`}>
                    <Button className="w-full">Get started</Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
