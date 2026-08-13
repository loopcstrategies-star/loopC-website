import Link from "next/link";
import { prisma } from "@/server/db";
import { PricingTable } from "@/components/pricing/pricing-table";

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    include: { features: true, limits: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-full">
      <header className="page-shell marketing-nav">
        <Link href="/" className="brand-mark">
          LoopC ERP
        </Link>
        <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
          Log in
        </Link>
      </header>
      <main className="page-shell py-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Simple plans for every stage
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Start with what you need. Upgrade when your team grows.
          </p>
        </div>
        <PricingTable
          plans={plans.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: p.description,
            monthlyPriceInr: p.monthlyPriceInr,
            yearlyPriceInr: p.yearlyPriceInr,
            isCustomPricing: p.isCustomPricing,
            supportLevel: p.supportLevel,
            features: p.features,
            limits: p.limits,
          }))}
        />
      </main>
    </div>
  );
}
