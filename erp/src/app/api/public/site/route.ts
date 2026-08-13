import { prisma } from "@/server/db";
import { handleRouteError } from "@/lib/http";
import { jsonOkPublic, publicCorsPreflight, withPublicCors } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS(req: Request) {
  return publicCorsPreflight(req.headers.get("origin"));
}

export async function GET() {
  try {
    const site =
      (await prisma.siteSetting.findUnique({ where: { id: "default" } })) ??
      (await prisma.siteSetting.create({ data: { id: "default" } }));

    const home = await prisma.websitePage.findUnique({
      where: { slug: "home" },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { sortOrder: "asc" },
        },
        seo: true,
      },
    });

    return jsonOkPublic({ site, home });
  } catch (err) {
    return withPublicCors(handleRouteError(err));
  }
}
