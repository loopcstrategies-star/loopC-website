/**
 * Smoke script: signup → checkout session → webhook confirm → assert ACTIVE.
 * Run: npx tsx scripts/smoke-billing.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, BillingCycle } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { nanoid } from "nanoid";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const plan = await prisma.plan.findUnique({ where: { slug: "starter" } });
    if (!plan) throw new Error("Starter plan missing — run npm run db:seed");

    const email = `smoke-${Date.now()}@example.com`;
    const passwordHash = await bcrypt.hash("SmokeTest123!", 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: "Smoke User",
        phone: "9876543210",
        country: "IN",
      },
    });

    const { createCompanyWithOwner } = await import("../src/server/tenancy");
    const { company } = await createCompanyWithOwner({
      userId: user.id,
      companyName: `Smoke Co ${Date.now()}`,
      country: "IN",
      employeeCount: 5,
    });

    const { quoteSubscription } = await import("../src/server/billing/quote");
    const quote = await quoteSubscription({
      planId: plan.id,
      billingCycle: BillingCycle.MONTHLY,
      couponCode: "LAUNCH20",
    });

    console.log("Quote:", {
      subtotal: quote.subtotalInr,
      discount: quote.discountInr,
      tax: quote.taxInr,
      total: quote.totalInr,
    });

    const { BillingService } = await import("../src/server/billing/service");
    const checkout = await BillingService.startCheckout({
      companyId: company.id,
      userId: user.id,
      planId: plan.id,
      billingCycle: BillingCycle.MONTHLY,
      couponCode: "LAUNCH20",
    });

    console.log("Checkout order:", checkout.order.orderId);

    const result = await BillingService.confirmPaymentFromWebhook({
      providerEventId: `smoke_${nanoid(12)}`,
      providerOrderId: checkout.order.orderId,
      providerPaymentId: `pay_smoke_${nanoid(10)}`,
      amountPaise: checkout.checkout.totalInr,
      rawPayload: { smoke: true },
    });

    const sub = await prisma.subscription.findUnique({
      where: { companyId: company.id },
      include: { plan: true, invoices: true },
    });

    console.log("Subscription status:", sub?.status);
    console.log("Plan:", sub?.plan.slug);
    console.log("Invoices:", sub?.invoices.length);
    console.log("Webhook result:", result);

    if (sub?.status !== "ACTIVE") {
      throw new Error(`Expected ACTIVE, got ${sub?.status}`);
    }

    const { assertFeature } = await import("../src/server/access/features");
    await assertFeature(company.id, "accounting");
    console.log("Feature gate accounting: OK");

    let blocked = false;
    try {
      await assertFeature(company.id, "hr");
    } catch {
      blocked = true;
    }
    if (!blocked) throw new Error("HR should be blocked on Starter");
    console.log("Feature gate hr blocked: OK");

    console.log("SMOKE PASS");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("SMOKE FAIL", e);
  process.exit(1);
});
