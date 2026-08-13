import { z } from "zod";
import { requireSession } from "@/server/auth";
import { assertFeature } from "@/server/access/features";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const schema = z.object({
  moduleKey: z.string().trim().min(1).max(80),
});

/**
 * Backend feature gate used by ERP clients.
 * Frontend menu hiding alone is not enough — call this (or assertFeature) before protected work.
 */
export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const companyId = session.user.companyId;
    if (!companyId) {
      return jsonError("No company context", 400, "NO_COMPANY");
    }

    const body = schema.parse(await req.json());
    await assertFeature(companyId, body.moduleKey);
    return jsonOk({ allowed: true, moduleKey: body.moduleKey });
  } catch (err) {
    return handleRouteError(err);
  }
}
