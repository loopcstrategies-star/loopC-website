import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAppSession } from "@/lib/session-guards";
import { getPaymentProvider } from "@/server/billing/razorpay";
import { prisma } from "@/server/db";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; cycle?: string }>;
}) {
  await requireAppSession();
  const params = await searchParams;
  const planSlug = params.plan;
  const cycle = params.cycle === "YEARLY" ? "YEARLY" : "MONTHLY";

  if (!planSlug) redirect("/pricing");

  const plan = await prisma.plan.findFirst({
    where: {
      OR: [{ slug: planSlug }, { id: planSlug }],
      isActive: true,
    },
  });

  if (!plan) redirect("/pricing");

  if (plan.isCustomPricing) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardTitle>Enterprise pricing</CardTitle>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Custom plans are sold with sales-assisted pricing.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="mailto:sales@loopcstrategies.com">
              <Button>Contact sales</Button>
            </a>
            <Link href="/pricing">
              <Button variant="secondary">Back to pricing</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const provider = getPaymentProvider();

  return (
    <div className="flex min-h-full flex-col">
      <header className="page-shell marketing-nav">
        <Link href="/" className="brand-mark">
          LoopC ERP
        </Link>
      </header>
      <main className="page-shell flex flex-1 items-center justify-center py-12">
        <CheckoutForm
          planId={plan.id}
          planName={plan.name}
          billingCycle={cycle}
          isMockProvider={provider.name === "mock"}
        />
      </main>
    </div>
  );
}
