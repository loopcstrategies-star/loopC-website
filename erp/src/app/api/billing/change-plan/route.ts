import { z } from "zod";
import { BillingCycle } from "@prisma/client";
import { requireSession } from "@/server/auth";
import { BillingService } from "@/server/billing/service";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const schema = z.object({
  planId: z.string().min(1),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (!session.user.companyId) {
      return jsonError("Company required", 400, "COMPANY_REQUIRED");
    }
    const body = schema.parse(await req.json());
    const result = await BillingService.scheduleOrApplyPlanChange({
      companyId: session.user.companyId,
      newPlanId: body.planId,
      actorId: session.user.id,
      billingCycle: body.billingCycle as BillingCycle | undefined,
    });
    return jsonOk({
      ...result,
      message:
        result.mode === "scheduled"
          ? "Downgrade scheduled for next cycle"
          : "Plan updated",
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
