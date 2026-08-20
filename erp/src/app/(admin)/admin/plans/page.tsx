import { AdminPlansClient } from "@/components/admin/plans-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminPlansPage() {
  await requireAdminSession();
  const [plans, billing] = await Promise.all([
    prisma.plan.findMany({
      include: { features: true, limits: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.billingSettings.findFirst(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ERP Plans</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Prices and features shown on the public website come from this list.
        </p>
      </div>
      <AdminPlansClient
        currency={billing?.currency ?? "INR"}
        plans={plans.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description,
          monthlyPriceInr: p.monthlyPriceInr,
          yearlyPriceInr: p.yearlyPriceInr,
          isActive: p.isActive,
          isCustomPricing: p.isCustomPricing,
          isPopular: p.isPopular,
          sortOrder: p.sortOrder,
          supportLevel: p.supportLevel,
          trialEligible: p.trialEligible,
          features: p.features.map((f) => ({
            moduleKey: f.moduleKey,
            enabled: f.enabled,
            label: f.label,
          })),
          limits: p.limits.map((l) => ({ limitKey: l.limitKey, value: l.value })),
        }))}
      />
    </div>
  );
}
