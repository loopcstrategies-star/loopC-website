import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      include: { features: true, limits: true },
      orderBy: { sortOrder: "asc" },
    });
    return jsonOk({ plans });
  } catch (err) {
    return handleRouteError(err);
  }
}
