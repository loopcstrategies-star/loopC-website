import { z } from "zod";
import { nanoid } from "nanoid";
import { requireSession } from "@/server/auth";
import { BillingService } from "@/server/billing/service";
import { getPaymentProvider } from "@/server/billing/razorpay";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const schema = z.object({
  providerOrderId: z.string().min(1).optional(),
  checkoutSessionId: z.string().min(1).optional(),
});

/**
 * Dev-only helper: simulates a successful Razorpay webhook when keys are missing.
 * Never activates subscriptions from the browser when a real provider is configured.
 */
export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (!session.user.companyId) {
      return jsonError("Company required", 400, "COMPANY_REQUIRED");
    }

    const provider = getPaymentProvider();
    const hasKeys =
      Boolean(process.env.RAZORPAY_KEY_ID?.trim()) &&
      Boolean(process.env.RAZORPAY_KEY_SECRET?.trim());

    if (provider.name !== "mock" || hasKeys) {
      return jsonError(
        "Mock complete is only available when Razorpay keys are not configured",
        403,
        "MOCK_DISABLED",
      );
    }

    // Allowed in local/prod builds whenever the mock provider is active (no Razorpay keys).
    // Never enables when real keys are present.
    const body = schema.parse(await req.json());

    const checkout = await prisma.checkoutSession.findFirst({
      where: {
        companyId: session.user.companyId,
        ...(body.checkoutSessionId
          ? { id: body.checkoutSessionId }
          : body.providerOrderId
            ? { providerOrderId: body.providerOrderId }
            : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    if (!checkout?.providerOrderId) {
      return jsonError("Checkout session not found", 404, "CHECKOUT_NOT_FOUND");
    }

    const result = await BillingService.confirmPaymentFromWebhook({
      providerEventId: `mock_${nanoid(16)}`,
      providerOrderId: checkout.providerOrderId,
      providerPaymentId: `pay_mock_${nanoid(12)}`,
      amountPaise: checkout.totalInr,
      rawPayload: { mock: true, userId: session.user.id },
    });

    return jsonOk({ ok: true, result });
  } catch (err) {
    return handleRouteError(err);
  }
}
