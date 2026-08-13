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
    const post = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
      include: { category: true },
    });
    if (!post) return jsonErrorPublic("Post not found", 404);
    return jsonOkPublic({ post });
  } catch (err) {
    return withPublicCors(handleRouteError(err));
  }
}
