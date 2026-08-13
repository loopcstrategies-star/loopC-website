import { prisma } from "@/server/db";
import { handleRouteError } from "@/lib/http";
import {
  jsonErrorPublic,
  jsonOkPublic,
  publicCorsPreflight,
  withPublicCors,
} from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return publicCorsPreflight();
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await ctx.params;
    const service = await prisma.cmsService.findFirst({
      where: { slug, isActive: true },
    });
    if (!service) return jsonErrorPublic("Service not found", 404);
    return jsonOkPublic({ service });
  } catch (err) {
    return withPublicCors(handleRouteError(err));
  }
}
