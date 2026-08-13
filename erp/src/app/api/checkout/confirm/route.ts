import { z } from "zod";
import { requireSession } from "@/server/auth";
import { BillingService } from "@/server/billing/service";
import { getPaymentProvider } from "@/server/billing/razorpay";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { rateLimitDistributed } from "@/server/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  razorpay_order_id: z.string().min(3),
  razorpay_payment_id: z.string().min(3),
  razorpay_signature: z.string().min(10),
});

/**
 * Client-side Razorpay success path: verify payment signature server-side,
 * then activate via the same confirm path as webhooks (idempotent).
 */
export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const companyId = session.user.companyId;
    if (!companyId) return jsonError("No company on session", 400, "NO_COMPANY");

    const limited = await rateLimitDistributed(
      `checkout-confirm:${session.user.id}`,
      20,
      60_000,
    );
    if (!limited.success) return jsonError("Too many requests", 429);

    const body = schema.parse(await req.json());
    const provider = getPaymentProvider();

    if (
      !provider.verifyPaymentSignature({
        orderId: body.razorpay_order_id,
        paymentId: body.razorpay_payment_id,
        signature: body.razorpay_signature,
      })
    ) {
      return jsonError("Invalid payment signature", 400, "INVALID_SIGNATURE");
    }

    const checkout = await prisma.checkoutSession.findFirst({
      where: {
        providerOrderId: body.razorpay_order_id,
        companyId,
      },
    });
    if (!checkout) {
      return jsonError("Checkout session not found", 404, "CHECKOUT_NOT_FOUND");
    }

    const result = await BillingService.confirmPaymentFromWebhook({
      providerEventId: `client_confirm_${body.razorpay_payment_id}`,
      providerOrderId: body.razorpay_order_id,
      providerPaymentId: body.razorpay_payment_id,
      amountPaise: checkout.totalInr,
      rawPayload: { source: "checkout.confirm", ...body },
    });

    return jsonOk({
      ok: true,
      alreadyProcessed: "alreadyProcessed" in result && result.alreadyProcessed,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
