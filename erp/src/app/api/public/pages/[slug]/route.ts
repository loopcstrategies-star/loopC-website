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
    const page = await prisma.websitePage.findFirst({
      where: { slug, status: "published" },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { sortOrder: "asc" },
        },
        seo: true,
      },
    });
    if (!page) return jsonErrorPublic("Page not found", 404);

    const seo =
      page.seo ??
      (await prisma.seoMetadata.findUnique({ where: { pageSlug: slug } }));

    return jsonOkPublic({ page: { ...page, seo: seo ?? page.seo } });
  } catch (err) {
    return withPublicCors(handleRouteError(err));
  }
}
