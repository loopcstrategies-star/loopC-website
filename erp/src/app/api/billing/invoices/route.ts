import { requireSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireSession();
    if (!session.user.companyId) {
      return jsonError("Company required", 400, "COMPANY_REQUIRED");
    }
    const invoices = await prisma.invoice.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return jsonOk({ invoices });
  } catch (err) {
    return handleRouteError(err);
  }
}
