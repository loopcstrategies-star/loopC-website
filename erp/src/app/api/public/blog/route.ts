import { prisma } from "@/server/db";
import { handleRouteError } from "@/lib/http";
import { jsonOkPublic, publicCorsPreflight, withPublicCors } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return publicCorsPreflight();
}

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return jsonOkPublic({ posts });
  } catch (err) {
    return withPublicCors(handleRouteError(err));
  }
}
