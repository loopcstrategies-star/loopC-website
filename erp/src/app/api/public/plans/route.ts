import { prisma } from "@/server/db";
import { handleRouteError } from "@/lib/http";
import { jsonOkPublic, publicCorsPreflight, withPublicCors } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS(req: Request) {
  return publicCorsPreflight(req.headers.get("origin"));
}

/** Same payload as `/api/plans`, with CORS for the marketing site. */
export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      include: { features: true, limits: true },
      orderBy: { sortOrder: "asc" },
    });
    return jsonOkPublic({ plans }, undefined, origin);
  } catch (err) {
    return withPublicCors(handleRouteError(err), origin);
  }
}
