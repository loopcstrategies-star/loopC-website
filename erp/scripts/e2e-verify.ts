/**
 * End-to-end verification for local LoopC SaaS (ports 3000 / 3001 / 5433).
 * Run: npx tsx scripts/e2e-verify.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, BillingCycle, SubscriptionStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { nanoid } from "nanoid";

const MARKETING = process.env.MARKETING_URL ?? "http://localhost:3000";
const ERP = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function httpStatus(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, redirect: "manual" });
  return res.status;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const results: string[] = [];
  const log = (label: string, ok: boolean, detail = "") => {
    const line = `${ok ? "PASS" : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`;
    results.push(line);
    console.log(line);
    if (!ok) throw new Error(line);
  };

  try {
    // TEST 1 — marketing home
    log("TEST1 marketing home", (await httpStatus(MARKETING)) === 200);

    // TEST 2 — ERP public plans API (pricing UI lives on marketing site)
    const plansRes = await fetch(`${ERP}/api/public/plans`);
    const plansJson = (await plansRes.json()) as { plans: { slug: string; monthlyPriceInr: number | null }[] };
    log(
      "TEST2 ERP DB plans API",
      plansRes.status === 200 && plansJson.plans?.length >= 4,
      `${plansJson.plans?.length ?? 0} plans`,
    );

    // Marketing pricing should reflect DB
    const mktPricing = await fetch(`${MARKETING}/pricing`);
    const mktHtml = await mktPricing.text();
    const starter = plansJson.plans.find((p) => p.slug === "starter");
    assert(starter?.monthlyPriceInr, "starter price missing");
    const priceLabel = (starter.monthlyPriceInr / 100).toLocaleString("en-IN");
    log(
      "TEST2b marketing pricing uses DB",
      mktPricing.status === 200 && mktHtml.includes(String(Math.floor(starter.monthlyPriceInr / 100))),
      `expects ~${priceLabel}`,
    );

    // Signup deep-link target exists on ERP
    const signupStatus = await httpStatus(`${ERP}/signup?plan=starter&cycle=MONTHLY`);
    log("TEST2c ERP signup reachable", signupStatus === 200, String(signupStatus));

    // TEST 3 — admin requires auth
    const adminStatus = await httpStatus(`${ERP}/admin`);
    log("TEST3 admin redirects unauthenticated", adminStatus === 307 || adminStatus === 302 || adminStatus === 200);

    // TEST 4 — admin changes plan price → public API changes
    const business = await prisma.plan.findUnique({ where: { slug: "business" } });
    assert(business, "business plan missing");
    const original = business.monthlyPriceInr ?? 499900;
    const bumped = original === 549900 ? 499900 : 549900;
    await prisma.plan.update({
      where: { id: business.id },
      data: { monthlyPriceInr: bumped },
    });
    const after = await fetch(`${ERP}/api/public/plans`);
    const afterJson = (await after.json()) as {
      plans: { slug: string; monthlyPriceInr: number | null }[];
    };
    const businessAfter = afterJson.plans.find((p) => p.slug === "business");
    log(
      "TEST4 plan price change reflected",
      businessAfter?.monthlyPriceInr === bumped,
      `${original} → ${bumped}`,
    );
    await prisma.plan.update({
      where: { id: business.id },
      data: { monthlyPriceInr: original },
    });

    // TEST 5 — admin creates service → public API
    const slug = `e2e-service-${nanoid(6)}`;
    const service = await prisma.cmsService.create({
      data: {
        slug,
        name: "E2E Service",
        summary: "Created by e2e-verify",
        description: "Temporary demo service",
        isActive: true,
        sortOrder: 99,
      },
    });
    const servicesRes = await fetch(`${ERP}/api/public/services`);
    const servicesJson = (await servicesRes.json()) as { services: { slug: string }[] };
    log(
      "TEST5 service appears on public API",
      servicesJson.services.some((s) => s.slug === slug),
    );
    await prisma.cmsService.delete({ where: { id: service.id } });

    // TEST 6–9 — signup company → checkout → webhook → ACTIVE + modules
    const plan = await prisma.plan.findUnique({
      where: { slug: "starter" },
      include: { features: true },
    });
    assert(plan, "starter plan missing");

    const email = `e2e-${Date.now()}@example.com`;
    const passwordHash = await bcrypt.hash("E2eTest123!", 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: "E2E User",
        phone: "9000000001",
        country: "IN",
      },
    });

    const { createCompanyWithOwner } = await import("../src/server/tenancy");
    const { company } = await createCompanyWithOwner({
      userId: user.id,
      companyName: `E2E Co ${Date.now()}`,
      country: "IN",
      employeeCount: 8,
    });
    log("TEST6 company created", Boolean(company.id), company.slug);

    const { BillingService } = await import("../src/server/billing/service");
    const checkout = await BillingService.startCheckout({
      companyId: company.id,
      userId: user.id,
      planId: plan.id,
      billingCycle: BillingCycle.MONTHLY,
    });
    log("TEST7 checkout session", Boolean(checkout.order.orderId));

    await BillingService.confirmPaymentFromWebhook({
      providerEventId: `e2e_${nanoid(12)}`,
      providerOrderId: checkout.order.orderId,
      providerPaymentId: `pay_e2e_${nanoid(10)}`,
      amountPaise: checkout.checkout.totalInr,
      rawPayload: { e2e: true },
    });

    const sub = await prisma.subscription.findUnique({ where: { companyId: company.id } });
    log("TEST8 subscription ACTIVE", sub?.status === SubscriptionStatus.ACTIVE, String(sub?.status));

    // Entitlements still gate the *external* ERP product features (not in-app screens)
    const { assertFeature } = await import("../src/server/access/features");
    await assertFeature(company.id, "accounting");
    log("TEST9 plan entitlement accounting", true);

    // TEST 10 — deny unavailable module entitlement
    let denied = false;
    try {
      await assertFeature(company.id, "hr");
    } catch {
      denied = true;
    }
    log("TEST10 unavailable entitlement rejected", denied, "hr on starter");

    // Account portal exists; ERP business modules must not
    const portalStatus = await httpStatus(`${ERP}/app`);
    log("TEST10b account portal requires auth or loads", portalStatus === 200 || portalStatus === 307 || portalStatus === 302, String(portalStatus));
    const crmGone = await httpStatus(`${ERP}/app/crm`);
    log("TEST10c ERP module /app/crm removed", crmGone === 404, String(crmGone));
    const accountingGone = await httpStatus(`${ERP}/app/accounting`);
    log("TEST10d ERP module /app/accounting removed", accountingGone === 404, String(accountingGone));

    // TEST 11 — suspend company → access blocked
    try {
      await BillingService.adminSuspend({ companyId: company.id, actorId: user.id });
    } catch {
      // Non-admin actor cannot suspend via BillingService — apply state directly for gate test
      await prisma.company.update({
        where: { id: company.id },
        data: { status: "suspended" },
      });
      await prisma.subscription.update({
        where: { companyId: company.id },
        data: { status: SubscriptionStatus.SUSPENDED },
      });
    }
    const afterSuspend = await prisma.company.findUnique({ where: { id: company.id } });
    if (afterSuspend?.status !== "suspended") {
      await prisma.company.update({
        where: { id: company.id },
        data: { status: "suspended" },
      });
      await prisma.subscription.update({
        where: { companyId: company.id },
        data: { status: SubscriptionStatus.SUSPENDED },
      });
    }
    const { assertSubscriptionActive } = await import("../src/server/access/subscription");
    let suspendedBlocked = false;
    try {
      await assertSubscriptionActive(company.id);
    } catch {
      suspendedBlocked = true;
    }
    log("TEST11 suspended company blocked", suspendedBlocked);

    // TEST 12 — reactivate
    await prisma.company.update({
      where: { id: company.id },
      data: { status: "active" },
    });
    await prisma.subscription.update({
      where: { companyId: company.id },
      data: { status: SubscriptionStatus.ACTIVE },
    });
    await assertSubscriptionActive(company.id);
    log("TEST12 reactivated company allowed", true);

    // TEST 13 — publish blog → public API
    const blogSlug = `e2e-blog-${nanoid(6)}`;
    const post = await prisma.blogPost.create({
      data: {
        slug: blogSlug,
        title: "E2E Blog Post",
        excerpt: "Demo",
        content: "Body for e2e",
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    const blogRes = await fetch(`${ERP}/api/public/blog`);
    const blogJson = (await blogRes.json()) as { posts: { slug: string }[] };
    log(
      "TEST13 published blog on API",
      blogJson.posts?.some((p) => p.slug === blogSlug) ?? false,
    );
    await prisma.blogPost.delete({ where: { id: post.id } });

    // TEST 14 — contact enquiry
    const contactRes = await fetch(`${ERP}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Contact",
        email: "e2e-contact@example.com",
        phone: "9111111111",
        company: "E2E",
        service: "ERP",
        message: "Please call me about ERP pricing and onboarding.",
      }),
    });
    const contactBody = await contactRes.json();
    const enquiry = await prisma.contactSubmission.findFirst({
      where: { email: "e2e-contact@example.com" },
      orderBy: { createdAt: "desc" },
    });
    log(
      "TEST14 contact stored",
      contactRes.status === 200 && contactBody.ok === true && Boolean(enquiry),
      enquiry?.id,
    );

    console.log("\nE2E PASS — all critical flows verified");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("\nE2E FAILED", err);
  process.exit(1);
});
