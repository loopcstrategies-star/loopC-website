import { z } from "zod";
import { BillingCycle } from "@prisma/client";
import { requireSession } from "@/server/auth";
import { BillingService } from "@/server/billing/service";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { rateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  planId: z.string().min(1),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  couponCode: z.string().trim().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (!session.user.companyId) {
      return jsonError("Company required", 400, "COMPANY_REQUIRED");
    }

    const limited = rateLimit(`checkout:${session.user.id}`, 20, 60_000);
    if (!limited.success) return jsonError("Too many requests", 429);

    const body = schema.parse(await req.json());
    const result = await BillingService.startCheckout({
      companyId: session.user.companyId,
      userId: session.user.id,
      planId: body.planId,
      billingCycle: body.billingCycle as BillingCycle,
      couponCode: body.couponCode,
    });

    return jsonOk(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
