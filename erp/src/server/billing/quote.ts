import { BillingCycle, CouponType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db";

export const quoteInputSchema = z.object({
  planId: z.string().min(1),
  billingCycle: z.nativeEnum(BillingCycle),
  couponCode: z.string().trim().min(1).optional(),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;

export type QuoteResult = {
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  /** Base price in paise before discount/tax */
  subtotalInr: number;
  discountInr: number;
  taxInr: number;
  taxPercent: number;
  totalInr: number;
  couponId: string | null;
  couponCode: string | null;
  currency: string;
};

async function getBillingSettings() {
  return (
    (await prisma.billingSettings.findUnique({ where: { id: "default" } })) ??
    (await prisma.billingSettings.create({ data: { id: "default" } }))
  );
}

/**
 * Quote a subscription charge. All money fields are integer paise (₹ * 100).
 */
export async function quoteSubscription(input: QuoteInput): Promise<QuoteResult> {
  const parsed = quoteInputSchema.parse(input);
  const plan = await prisma.plan.findUnique({ where: { id: parsed.planId } });

  if (!plan || !plan.isActive) {
    throw Object.assign(new Error("Plan not found or inactive"), { code: "PLAN_NOT_FOUND" });
  }

  if (plan.isCustomPricing) {
    throw Object.assign(new Error("Enterprise/custom plans require sales-assisted pricing"), {
      code: "CUSTOM_PRICING",
    });
  }

  const base =
    parsed.billingCycle === BillingCycle.YEARLY ? plan.yearlyPriceInr : plan.monthlyPriceInr;

  if (base == null) {
    throw Object.assign(new Error("Plan has no price for the selected billing cycle"), {
      code: "PRICE_MISSING",
    });
  }

  const settings = await getBillingSettings();
  let discountInr = 0;
  let couponId: string | null = null;
  let couponCode: string | null = null;

  if (parsed.couponCode) {
    const code = parsed.couponCode.toUpperCase();
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    const now = new Date();

    if (!coupon || !coupon.isActive) {
      throw Object.assign(new Error("Invalid coupon code"), { code: "COUPON_INVALID" });
    }
    if (coupon.validFrom && coupon.validFrom > now) {
      throw Object.assign(new Error("Coupon is not yet valid"), { code: "COUPON_NOT_STARTED" });
    }
    if (coupon.validUntil && coupon.validUntil < now) {
      throw Object.assign(new Error("Coupon has expired"), { code: "COUPON_EXPIRED" });
    }
    if (coupon.maxRedemptions != null && coupon.redemptionCount >= coupon.maxRedemptions) {
      throw Object.assign(new Error("Coupon redemption limit reached"), {
        code: "COUPON_EXHAUSTED",
      });
    }

    if (coupon.type === CouponType.PERCENT) {
      discountInr = Math.floor((base * coupon.value) / 100);
    } else {
      discountInr = Math.min(base, coupon.value);
    }

    couponId = coupon.id;
    couponCode = coupon.code;
  }

  const taxable = Math.max(0, base - discountInr);
  const taxInr = Math.floor((taxable * settings.taxPercent) / 100);
  const totalInr = taxable + taxInr;

  return {
    planId: plan.id,
    planName: plan.name,
    billingCycle: parsed.billingCycle,
    subtotalInr: base,
    discountInr,
    taxInr,
    taxPercent: settings.taxPercent,
    totalInr,
    couponId,
    couponCode,
    currency: settings.currency,
  };
}
