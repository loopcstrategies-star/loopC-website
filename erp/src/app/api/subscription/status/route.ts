import { requireSession } from "@/server/auth";
import { getCompanySubscription } from "@/server/access/subscription";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireSession();
    if (!session.user.companyId) {
      return jsonError("Company required", 400, "COMPANY_REQUIRED");
    }

    const subscription = await getCompanySubscription(session.user.companyId);
    return jsonOk({
      status: subscription?.status ?? null,
      planId: subscription?.planId ?? null,
      planName: subscription?.plan.name ?? null,
      billingCycle: subscription?.billingCycle ?? null,
      renewalDate: subscription?.renewalDate ?? null,
      trialEndDate: subscription?.trialEndDate ?? null,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
