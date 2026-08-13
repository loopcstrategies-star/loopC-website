import {
  BillingCycle,
  DowngradeMode,
  PaymentStatus,
  SubscriptionStatus,
} from "@prisma/client";
import { addDays, addMonths, addYears } from "date-fns";
import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/audit";
import { quoteSubscription } from "@/server/billing/quote";
import { getPaymentProvider } from "@/server/billing/razorpay";
import { createInvoiceFromPayment } from "@/server/billing/invoices";

async function getBillingSettings() {
  return (
    (await prisma.billingSettings.findUnique({ where: { id: "default" } })) ??
    (await prisma.billingSettings.create({ data: { id: "default" } }))
  );
}

function periodEnd(from: Date, cycle: BillingCycle): Date {
  return cycle === BillingCycle.YEARLY ? addYears(from, 1) : addMonths(from, 1);
}

function coded(code: string, message: string): Error {
  return Object.assign(new Error(message), { code });
}

function prorateCreditPaise(input: {
  oldPricePaise: number;
  startDate: Date;
  renewalDate: Date;
  asOf?: Date;
}): number {
  const asOf = input.asOf ?? new Date();
  const totalMs = input.renewalDate.getTime() - input.startDate.getTime();
  if (totalMs <= 0) return 0;
  const remainingMs = Math.max(0, input.renewalDate.getTime() - asOf.getTime());
  return Math.floor((input.oldPricePaise * remainingMs) / totalMs);
}

export class BillingService {
  /**
   * Creates a CheckoutSession + provider order. Does NOT activate the subscription.
   */
  static async startCheckout(input: {
    companyId: string;
    userId: string;
    planId: string;
    billingCycle: BillingCycle;
    couponCode?: string;
  }) {
    const company = await prisma.company.findUnique({ where: { id: input.companyId } });
    if (!company) throw coded("COMPANY_NOT_FOUND", "Company not found");

    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) throw coded("USER_NOT_FOUND", "User not found");

    const quote = await quoteSubscription({
      planId: input.planId,
      billingCycle: input.billingCycle,
      couponCode: input.couponCode,
    });

    const provider = getPaymentProvider();

    let paymentCustomer = await prisma.paymentCustomer.findFirst({
      where: { companyId: input.companyId, provider: provider.name },
    });

    if (!paymentCustomer) {
      const created = await provider.createCustomer({
        companyId: input.companyId,
        name: company.name,
        email: user.email,
        phone: user.phone,
      });
      paymentCustomer = await prisma.paymentCustomer.create({
        data: {
          companyId: input.companyId,
          provider: provider.name,
          providerCustomerId: created.providerCustomerId,
        },
      });
    }

    const expiresAt = addDays(new Date(), 1);
    const checkout = await prisma.checkoutSession.create({
      data: {
        companyId: input.companyId,
        userId: input.userId,
        planId: input.planId,
        billingCycle: input.billingCycle,
        couponCode: quote.couponCode ?? undefined,
        amountInr: quote.subtotalInr,
        taxInr: quote.taxInr,
        discountInr: quote.discountInr,
        totalInr: quote.totalInr,
        status: "pending",
        expiresAt,
      },
    });

    const order = await provider.createOrder({
      amountPaise: quote.totalInr,
      currency: quote.currency,
      receipt: checkout.id.slice(0, 40),
      customerId: paymentCustomer.providerCustomerId,
      notes: {
        checkoutSessionId: checkout.id,
        companyId: input.companyId,
        planId: input.planId,
        billingCycle: input.billingCycle,
      },
    });

    const updated = await prisma.checkoutSession.update({
      where: { id: checkout.id },
      data: { providerOrderId: order.orderId },
    });

    await writeAuditLog({
      actorId: input.userId,
      companyId: input.companyId,
      action: "billing.checkout_started",
      entityType: "CheckoutSession",
      entityId: checkout.id,
      metadata: { orderId: order.orderId, totalInr: quote.totalInr },
    });

    return {
      checkout: updated,
      quote,
      order,
      provider: provider.name,
      paymentCustomerId: paymentCustomer.id,
    };
  }

  /**
   * Server-side activation path (webhooks / trusted jobs only).
   */
  static async confirmPaymentFromWebhook(input: {
    providerEventId: string;
    providerOrderId: string;
    providerPaymentId: string;
    amountPaise?: number;
    rawPayload?: unknown;
  }) {
    const checkout = await prisma.checkoutSession.findFirst({
      where: { providerOrderId: input.providerOrderId },
    });

    if (!checkout) {
      throw coded("CHECKOUT_NOT_FOUND", `No checkout for order ${input.providerOrderId}`);
    }

    if (checkout.status === "completed") {
      const existingPayment = await prisma.payment.findFirst({
        where: {
          OR: [
            { providerPaymentId: input.providerPaymentId },
            { providerEventId: input.providerEventId },
          ],
        },
        include: { invoice: true },
      });
      return { alreadyProcessed: true as const, checkout, payment: existingPayment };
    }

    if (checkout.expiresAt < new Date() && checkout.status === "pending") {
      throw coded("CHECKOUT_EXPIRED", "Checkout session has expired");
    }

    const quote = await quoteSubscription({
      planId: checkout.planId,
      billingCycle: checkout.billingCycle,
      couponCode: checkout.couponCode ?? undefined,
    });

    const now = new Date();
    const startDate = now;
    const renewalDate = periodEnd(startDate, checkout.billingCycle);

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          companyId: checkout.companyId,
          provider: getPaymentProvider().name,
          providerPaymentId: input.providerPaymentId,
          providerOrderId: input.providerOrderId,
          providerEventId: input.providerEventId,
          amountInr: input.amountPaise ?? checkout.totalInr,
          currency: "INR",
          status: PaymentStatus.SUCCEEDED,
          metadata: {
            checkoutSessionId: checkout.id,
            payload: input.rawPayload ?? undefined,
          },
        },
      });

      const existingSub = await tx.subscription.findUnique({
        where: { companyId: checkout.companyId },
      });

      const subscription = existingSub
        ? await tx.subscription.update({
            where: { id: existingSub.id },
            data: {
              planId: checkout.planId,
              status: SubscriptionStatus.ACTIVE,
              billingCycle: checkout.billingCycle,
              startDate,
              renewalDate,
              trialEndDate: null,
              pastDueSince: null,
              graceEndsAt: null,
              cancellationDate: null,
              scheduledPlanId: null,
              couponId: quote.couponId,
            },
          })
        : await tx.subscription.create({
            data: {
              companyId: checkout.companyId,
              planId: checkout.planId,
              status: SubscriptionStatus.ACTIVE,
              billingCycle: checkout.billingCycle,
              startDate,
              renewalDate,
              couponId: quote.couponId,
            },
          });

      await tx.payment.update({
        where: { id: payment.id },
        data: { subscriptionId: subscription.id },
      });

      await tx.checkoutSession.update({
        where: { id: checkout.id },
        data: { status: "completed" },
      });

      if (quote.couponId) {
        await tx.coupon.update({
          where: { id: quote.couponId },
          data: { redemptionCount: { increment: 1 } },
        });
        await tx.couponRedemption.create({
          data: {
            couponId: quote.couponId,
            userId: checkout.userId,
            companyId: checkout.companyId,
          },
        });
      }

      return { payment, subscription };
    });

    const invoice = await createInvoiceFromPayment({
      companyId: checkout.companyId,
      subscriptionId: result.subscription.id,
      paymentId: result.payment.id,
      subtotalInr: checkout.amountInr,
      taxInr: checkout.taxInr,
      discountInr: checkout.discountInr,
      totalInr: checkout.totalInr,
      billingPeriodStart: startDate,
      billingPeriodEnd: renewalDate,
      description: `Subscription ${checkout.billingCycle.toLowerCase()}`,
      paidAt: now,
    });

    await writeAuditLog({
      actorId: checkout.userId,
      companyId: checkout.companyId,
      action: "billing.payment_confirmed",
      entityType: "Subscription",
      entityId: result.subscription.id,
      metadata: {
        paymentId: result.payment.id,
        invoiceId: invoice.id,
        providerPaymentId: input.providerPaymentId,
      },
    });

    return {
      alreadyProcessed: false as const,
      checkout,
      payment: result.payment,
      subscription: result.subscription,
      invoice,
    };
  }

  static async markPaymentFailed(input: {
    companyId: string;
    providerOrderId?: string;
    providerPaymentId?: string;
    providerEventId?: string;
    reason?: string;
  }) {
    const settings = await getBillingSettings();
    const now = new Date();
    const graceEndsAt = addDays(now, settings.gracePeriodDays);

    const subscription = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
    });

    if (!subscription) {
      throw coded("SUBSCRIPTION_MISSING", "No subscription to mark past due");
    }

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.PAST_DUE,
        pastDueSince: subscription.pastDueSince ?? now,
        graceEndsAt,
      },
    });

    if (input.providerOrderId || input.providerPaymentId) {
      await prisma.payment.create({
        data: {
          companyId: input.companyId,
          subscriptionId: subscription.id,
          provider: getPaymentProvider().name,
          providerPaymentId: input.providerPaymentId,
          providerOrderId: input.providerOrderId,
          providerEventId: input.providerEventId,
          amountInr: 0,
          status: PaymentStatus.FAILED,
          failureReason: input.reason ?? "Payment failed",
        },
      });
    }

    const checkout = input.providerOrderId
      ? await prisma.checkoutSession.findFirst({
          where: { providerOrderId: input.providerOrderId },
        })
      : null;

    if (checkout && checkout.status === "pending") {
      await prisma.checkoutSession.update({
        where: { id: checkout.id },
        data: { status: "failed" },
      });
    }

    await writeAuditLog({
      companyId: input.companyId,
      action: "billing.payment_failed",
      entityType: "Subscription",
      entityId: updated.id,
      metadata: { graceEndsAt, reason: input.reason },
    });

    return updated;
  }

  static async startTrial(input: {
    companyId: string;
    planId: string;
    actorId?: string;
  }) {
    const settings = await getBillingSettings();
    if (!settings.trialEnabled) {
      throw coded("TRIAL_DISABLED", "Trials are disabled");
    }

    const plan = await prisma.plan.findUnique({ where: { id: input.planId } });
    if (!plan?.isActive) throw coded("PLAN_NOT_FOUND", "Plan not found");
    if (!plan.trialEligible) throw coded("TRIAL_INELIGIBLE", "Plan is not trial-eligible");

    const existing = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
    });
    if (existing && existing.status !== SubscriptionStatus.EXPIRED) {
      throw coded("SUBSCRIPTION_EXISTS", "Company already has a subscription");
    }

    const now = new Date();
    const trialEndDate = addDays(now, settings.trialDays);

    const subscription = existing
      ? await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            planId: input.planId,
            status: SubscriptionStatus.TRIAL,
            startDate: now,
            trialEndDate,
            renewalDate: trialEndDate,
            pastDueSince: null,
            graceEndsAt: null,
            cancellationDate: null,
            scheduledPlanId: null,
          },
        })
      : await prisma.subscription.create({
          data: {
            companyId: input.companyId,
            planId: input.planId,
            status: SubscriptionStatus.TRIAL,
            startDate: now,
            trialEndDate,
            renewalDate: trialEndDate,
          },
        });

    await writeAuditLog({
      actorId: input.actorId,
      companyId: input.companyId,
      action: "billing.trial_started",
      entityType: "Subscription",
      entityId: subscription.id,
      metadata: { trialEndDate, planId: input.planId },
    });

    return subscription;
  }

  static async cancelSubscription(input: {
    companyId: string;
    actorId?: string;
    atPeriodEnd?: boolean;
  }) {
    const subscription = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
    });
    if (!subscription) throw coded("SUBSCRIPTION_MISSING", "No subscription found");

    const provider = getPaymentProvider();
    if (subscription.paymentSubscriptionId) {
      await provider.cancelSubscription(subscription.paymentSubscriptionId);
    }

    const now = new Date();
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: input.atPeriodEnd
        ? {
            cancellationDate: subscription.renewalDate ?? now,
            // stays ACTIVE until renew job expires it
          }
        : {
            status: SubscriptionStatus.CANCELLED,
            cancellationDate: now,
          },
    });

    await writeAuditLog({
      actorId: input.actorId,
      companyId: input.companyId,
      action: "billing.subscription_cancelled",
      entityType: "Subscription",
      entityId: updated.id,
      metadata: { atPeriodEnd: Boolean(input.atPeriodEnd) },
    });

    return updated;
  }

  /**
   * Upgrades apply immediately and return a prorated amount due (paise).
   * Downgrades follow BillingSettings.downgradeMode.
   */
  static async scheduleOrApplyPlanChange(input: {
    companyId: string;
    newPlanId: string;
    actorId?: string;
    billingCycle?: BillingCycle;
  }) {
    const subscription = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
      include: { plan: true },
    });
    if (!subscription) throw coded("SUBSCRIPTION_MISSING", "No subscription found");

    const newPlan = await prisma.plan.findUnique({ where: { id: input.newPlanId } });
    if (!newPlan?.isActive) throw coded("PLAN_NOT_FOUND", "Target plan not found");

    const cycle = input.billingCycle ?? subscription.billingCycle;
    const settings = await getBillingSettings();

    const oldPrice =
      (subscription.billingCycle === BillingCycle.YEARLY
        ? subscription.plan.yearlyPriceInr
        : subscription.plan.monthlyPriceInr) ?? 0;
    const newPrice =
      (cycle === BillingCycle.YEARLY ? newPlan.yearlyPriceInr : newPlan.monthlyPriceInr) ?? 0;

    const isUpgrade = newPrice > oldPrice;
    const isDowngrade = newPrice < oldPrice;

    if (isUpgrade || (!isDowngrade && newPlan.id !== subscription.planId)) {
      // Immediate upgrade (or lateral plan swap)
      const credit =
        subscription.startDate && subscription.renewalDate
          ? prorateCreditPaise({
              oldPricePaise: oldPrice,
              startDate: subscription.startDate,
              renewalDate: subscription.renewalDate,
            })
          : 0;

      const fullNewQuote = await quoteSubscription({
        planId: newPlan.id,
        billingCycle: cycle,
      });

      // Prorated amount due for remainder of cycle (new price share minus credit)
      let prorateAmountDue = 0;
      if (subscription.startDate && subscription.renewalDate) {
        const totalMs =
          subscription.renewalDate.getTime() - subscription.startDate.getTime();
        const remainingMs = Math.max(
          0,
          subscription.renewalDate.getTime() - Date.now(),
        );
        const newShare =
          totalMs > 0 ? Math.floor((newPrice * remainingMs) / totalMs) : newPrice;
        prorateAmountDue = Math.max(0, newShare - credit);
      } else {
        prorateAmountDue = fullNewQuote.totalInr;
      }

      const updated = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          planId: newPlan.id,
          billingCycle: cycle,
          scheduledPlanId: null,
          status:
            subscription.status === SubscriptionStatus.TRIAL
              ? SubscriptionStatus.TRIAL
              : SubscriptionStatus.ACTIVE,
        },
      });

      await writeAuditLog({
        actorId: input.actorId,
        companyId: input.companyId,
        action: "billing.plan_upgraded",
        entityType: "Subscription",
        entityId: updated.id,
        metadata: {
          fromPlanId: subscription.planId,
          toPlanId: newPlan.id,
          prorateAmountDue,
          credit,
        },
      });

      return {
        mode: "immediate" as const,
        subscription: updated,
        prorateAmountDue,
        credit,
      };
    }

    // Downgrade
    if (settings.downgradeMode === DowngradeMode.IMMEDIATE) {
      const updated = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          planId: newPlan.id,
          billingCycle: cycle,
          scheduledPlanId: null,
        },
      });

      await writeAuditLog({
        actorId: input.actorId,
        companyId: input.companyId,
        action: "billing.plan_downgraded_immediate",
        entityType: "Subscription",
        entityId: updated.id,
        metadata: { fromPlanId: subscription.planId, toPlanId: newPlan.id },
      });

      return {
        mode: "immediate" as const,
        subscription: updated,
        prorateAmountDue: 0,
        credit: 0,
      };
    }

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { scheduledPlanId: newPlan.id },
    });

    await writeAuditLog({
      actorId: input.actorId,
      companyId: input.companyId,
      action: "billing.plan_downgrade_scheduled",
      entityType: "Subscription",
      entityId: updated.id,
      metadata: {
        fromPlanId: subscription.planId,
        scheduledPlanId: newPlan.id,
        effectiveAt: subscription.renewalDate,
      },
    });

    return {
      mode: "scheduled" as const,
      subscription: updated,
      prorateAmountDue: 0,
      credit: 0,
      effectiveAt: subscription.renewalDate,
    };
  }

  static async renewSubscription(input: {
    companyId: string;
    providerPaymentId?: string;
    providerOrderId?: string;
    providerEventId?: string;
    amountPaise?: number;
  }) {
    const subscription = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
      include: { plan: true },
    });
    if (!subscription) throw coded("SUBSCRIPTION_MISSING", "No subscription found");

    if (subscription.scheduledPlanId) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          planId: subscription.scheduledPlanId,
          scheduledPlanId: null,
        },
      });
    }

    const fresh = await prisma.subscription.findUniqueOrThrow({
      where: { id: subscription.id },
      include: { plan: true },
    });

    const quote = await quoteSubscription({
      planId: fresh.planId,
      billingCycle: fresh.billingCycle,
    });

    const startDate = fresh.renewalDate && fresh.renewalDate > new Date()
      ? fresh.renewalDate
      : new Date();
    const renewalDate = periodEnd(startDate, fresh.billingCycle);

    const payment = await prisma.payment.create({
      data: {
        companyId: input.companyId,
        subscriptionId: fresh.id,
        provider: getPaymentProvider().name,
        providerPaymentId: input.providerPaymentId,
        providerOrderId: input.providerOrderId,
        providerEventId: input.providerEventId,
        amountInr: input.amountPaise ?? quote.totalInr,
        status: PaymentStatus.SUCCEEDED,
      },
    });

    const updated = await prisma.subscription.update({
      where: { id: fresh.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        startDate,
        renewalDate,
        pastDueSince: null,
        graceEndsAt: null,
        cancellationDate: null,
      },
    });

    const invoice = await createInvoiceFromPayment({
      companyId: input.companyId,
      subscriptionId: updated.id,
      paymentId: payment.id,
      subtotalInr: quote.subtotalInr,
      taxInr: quote.taxInr,
      discountInr: quote.discountInr,
      totalInr: quote.totalInr,
      billingPeriodStart: startDate,
      billingPeriodEnd: renewalDate,
      description: `Renewal ${fresh.billingCycle.toLowerCase()} — ${fresh.plan.name}`,
    });

    await writeAuditLog({
      companyId: input.companyId,
      action: "billing.subscription_renewed",
      entityType: "Subscription",
      entityId: updated.id,
      metadata: { renewalDate, invoiceId: invoice.id },
    });

    return { subscription: updated, payment, invoice };
  }

  static async adminActivate(input: {
    companyId: string;
    planId: string;
    billingCycle?: BillingCycle;
    actorId?: string;
  }) {
    await requireSuperAdminActor(input.actorId);

    const now = new Date();
    const cycle = input.billingCycle ?? BillingCycle.MONTHLY;
    const renewalDate = periodEnd(now, cycle);

    const existing = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
    });

    await prisma.company.update({
      where: { id: input.companyId },
      data: { status: "active" },
    });

    const subscription = existing
      ? await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            planId: input.planId,
            status: SubscriptionStatus.ACTIVE,
            billingCycle: cycle,
            startDate: now,
            renewalDate,
            trialEndDate: null,
            pastDueSince: null,
            graceEndsAt: null,
            cancellationDate: null,
          },
        })
      : await prisma.subscription.create({
          data: {
            companyId: input.companyId,
            planId: input.planId,
            status: SubscriptionStatus.ACTIVE,
            billingCycle: cycle,
            startDate: now,
            renewalDate,
          },
        });

    await writeAuditLog({
      actorId: input.actorId,
      companyId: input.companyId,
      action: "billing.admin_activate",
      entityType: "Subscription",
      entityId: subscription.id,
    });

    return subscription;
  }

  static async adminSuspend(input: { companyId: string; actorId?: string }) {
    await requireSuperAdminActor(input.actorId);

    const subscription = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
    });
    if (!subscription) throw coded("SUBSCRIPTION_MISSING", "No subscription found");

    const [updated] = await prisma.$transaction([
      prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.SUSPENDED },
      }),
      prisma.company.update({
        where: { id: input.companyId },
        data: { status: "suspended" },
      }),
    ]);

    await writeAuditLog({
      actorId: input.actorId,
      companyId: input.companyId,
      action: "billing.admin_suspend",
      entityType: "Subscription",
      entityId: updated.id,
      metadata: { companyStatus: "suspended" },
    });

    return updated;
  }

  static async adminExtend(input: {
    companyId: string;
    days: number;
    actorId?: string;
  }) {
    await requireSuperAdminActor(input.actorId);
    if (input.days <= 0) throw coded("INVALID_DAYS", "days must be positive");

    const subscription = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
    });
    if (!subscription) throw coded("SUBSCRIPTION_MISSING", "No subscription found");

    const base =
      subscription.renewalDate && subscription.renewalDate > new Date()
        ? subscription.renewalDate
        : new Date();
    const renewalDate = addDays(base, input.days);

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        renewalDate,
        status:
          subscription.status === SubscriptionStatus.EXPIRED ||
          subscription.status === SubscriptionStatus.CANCELLED
            ? SubscriptionStatus.ACTIVE
            : subscription.status,
      },
    });

    await writeAuditLog({
      actorId: input.actorId,
      companyId: input.companyId,
      action: "billing.admin_extend",
      entityType: "Subscription",
      entityId: updated.id,
      metadata: { days: input.days, renewalDate },
    });

    return updated;
  }

  static async adminGrantTrial(input: {
    companyId: string;
    planId: string;
    days?: number;
    actorId?: string;
  }) {
    await requireSuperAdminActor(input.actorId);
    const settings = await getBillingSettings();
    const days = input.days ?? settings.trialDays;
    const now = new Date();
    const trialEndDate = addDays(now, days);

    const existing = await prisma.subscription.findUnique({
      where: { companyId: input.companyId },
    });

    const subscription = existing
      ? await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            planId: input.planId,
            status: SubscriptionStatus.TRIAL,
            startDate: now,
            trialEndDate,
            renewalDate: trialEndDate,
            pastDueSince: null,
            graceEndsAt: null,
            cancellationDate: null,
          },
        })
      : await prisma.subscription.create({
          data: {
            companyId: input.companyId,
            planId: input.planId,
            status: SubscriptionStatus.TRIAL,
            startDate: now,
            trialEndDate,
            renewalDate: trialEndDate,
          },
        });

    await writeAuditLog({
      actorId: input.actorId,
      companyId: input.companyId,
      action: "billing.admin_grant_trial",
      entityType: "Subscription",
      entityId: subscription.id,
      metadata: { days, trialEndDate },
    });

    return subscription;
  }
}

async function requireSuperAdminActor(actorId?: string) {
  if (!actorId) return;
  const user = await prisma.user.findUnique({
    where: { id: actorId },
    select: { isSuperAdmin: true },
  });
  if (!user?.isSuperAdmin) {
    throw coded("FORBIDDEN", "Super admin required");
  }
}
