import { prisma } from "@/server/db";
import { handleRouteError } from "@/lib/http";
import { jsonOkPublic, publicCorsPreflight, withPublicCors } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS(req: Request) {
  return publicCorsPreflight(req.headers.get("origin"));
}

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const pageSlug = params.get("pageSlug") ?? params.get("page") ?? undefined;
    const faqs = await prisma.faqItem.findMany({
      where: {
        isActive: true,
        ...(pageSlug ? { pageSlug } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
    return jsonOkPublic({ faqs });
  } catch (err) {
    return withPublicCors(handleRouteError(err));
  }
}
