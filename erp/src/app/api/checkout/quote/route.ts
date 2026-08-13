import { z } from "zod";
import { BillingCycle } from "@prisma/client";
import { quoteSubscription } from "@/server/billing/quote";
import { handleRouteError, jsonOk } from "@/lib/http";
import { requireSession } from "@/server/auth";

export const runtime = "nodejs";

const schema = z.object({
  planId: z.string().min(1),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  couponCode: z.string().trim().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    await requireSession();
    const body = schema.parse(await req.json());
    const quote = await quoteSubscription({
      planId: body.planId,
      billingCycle: body.billingCycle as BillingCycle,
      couponCode: body.couponCode,
    });
    return jsonOk({ quote });
  } catch (err) {
    return handleRouteError(err);
  }
}
