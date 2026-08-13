import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { getPaymentProvider } from "@/server/billing/razorpay";
import { BillingService } from "@/server/billing/service";
import { rateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

const paymentEntitySchema = z
  .object({
    id: z.string().optional(),
    order_id: z.string().optional(),
    amount: z.number().optional(),
    status: z.string().optional(),
    notes: z
      .object({
        companyId: z.string().optional(),
        checkoutSessionId: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export async function POST(req: Request) {
  const limited = rateLimit(
    `webhook:razorpay:${req.headers.get("x-forwarded-for") ?? "unknown"}`,
    120,
    60_000,
  );
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await req.text();

  const provider = getPaymentProvider();
  if (!provider.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    event?: string;
    id?: string;
    payload?: {
      payment?: { entity?: unknown };
      order?: { entity?: { id?: string } };
    };
  };

  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload.event ?? "unknown";
  const providerEventId =
    (typeof payload.id === "string" && payload.id) ||
    `${eventType}:${payload.payload?.payment?.entity && typeof payload.payload.payment.entity === "object" && "id" in (payload.payload.payment.entity as object) ? String((payload.payload.payment.entity as { id?: string }).id) : cryptoRandom()}`;

  const existing = await prisma.webhookEvent.findUnique({
    where: { providerEventId },
  });
  if (existing?.processedAt) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const eventRow =
    existing ??
    (await prisma.webhookEvent.create({
      data: {
        provider: provider.name,
        providerEventId,
        eventType,
        payload: payload as object,
      },
    }));

  try {
    const paymentEntity = paymentEntitySchema.safeParse(
      payload.payload?.payment?.entity,
    );
    const orderId =
      paymentEntity.success
        ? paymentEntity.data.order_id
        : payload.payload?.order?.entity?.id;

    if (eventType === "payment.captured" || eventType === "order.paid") {
      if (!orderId) {
        throw Object.assign(new Error("Missing order_id on payment event"), {
          code: "ORDER_ID_MISSING",
        });
      }

      const providerPaymentId =
        (paymentEntity.success && paymentEntity.data.id) ||
        `unknown_${providerEventId}`;

      await BillingService.confirmPaymentFromWebhook({
        providerEventId,
        providerOrderId: orderId,
        providerPaymentId,
        amountPaise: paymentEntity.success ? paymentEntity.data.amount : undefined,
        rawPayload: payload,
      });
    } else if (eventType === "payment.failed") {
      const companyId =
        (paymentEntity.success && paymentEntity.data.notes?.companyId) ||
        (orderId
          ? (
              await prisma.checkoutSession.findFirst({
                where: { providerOrderId: orderId },
                select: { companyId: true },
              })
            )?.companyId
          : undefined);

      if (companyId) {
        await BillingService.markPaymentFailed({
          companyId,
          providerOrderId: orderId,
          providerPaymentId: paymentEntity.success ? paymentEntity.data.id : undefined,
          providerEventId,
          reason: "Razorpay payment.failed",
        });
      }
    }

    await prisma.webhookEvent.update({
      where: { id: eventRow.id },
      data: { processedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    console.error("[razorpay webhook]", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function cryptoRandom() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
