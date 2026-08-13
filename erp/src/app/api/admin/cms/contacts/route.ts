import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await requireSuperAdmin();
    const status = new URL(req.url).searchParams.get("status") ?? undefined;
    const contacts = await prisma.contactSubmission.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return jsonOk({ contacts });
  } catch (err) {
    return handleRouteError(err);
  }
}
