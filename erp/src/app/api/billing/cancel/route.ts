import { z } from "zod";
import { requireSession } from "@/server/auth";
import { BillingService } from "@/server/billing/service";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const schema = z.object({
  atPeriodEnd: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (!session.user.companyId) {
      return jsonError("Company required", 400, "COMPANY_REQUIRED");
    }
    const body = schema.parse(await req.json().catch(() => ({})));
    const subscription = await BillingService.cancelSubscription({
      companyId: session.user.companyId,
      actorId: session.user.id,
      atPeriodEnd: body.atPeriodEnd,
    });
    return jsonOk({
      subscription,
      message: body.atPeriodEnd
        ? "Cancellation scheduled at period end"
        : "Subscription cancelled",
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
