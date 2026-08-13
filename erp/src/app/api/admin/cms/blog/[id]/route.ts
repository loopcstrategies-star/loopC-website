import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";
import { slugify } from "@/lib/constants";

export const runtime = "nodejs";

const updateSchema = z.object({
  slug: z.string().trim().min(1).max(80).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  excerpt: z.string().trim().max(500).nullable().optional(),
  content: z.string().nullable().optional(),
  authorName: z.string().trim().max(120).nullable().optional(),
  categoryId: z.string().nullable().optional(),
  categoryName: z.string().trim().max(80).optional(),
  featuredImageUrl: z.string().trim().max(800).nullable().optional(),
  tagsJson: z.unknown().nullable().optional(),
  seoTitle: z.string().trim().max(200).nullable().optional(),
  seoDescription: z.string().trim().max(400).nullable().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return jsonError("Post not found", 404);

    let categoryId = body.categoryId;
    if (body.categoryName) {
      const catSlug = slugify(body.categoryName);
      const category = await prisma.blogCategory.upsert({
        where: { slug: catSlug },
        create: { slug: catSlug, name: body.categoryName },
        update: { name: body.categoryName },
      });
      categoryId = category.id;
    }

    const isPublished = body.isPublished;
    let publishedAt: Date | null | undefined = undefined;
    if (body.publishedAt !== undefined) {
      publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    } else if (isPublished === true && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (isPublished === false) {
      publishedAt = null;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        authorName: body.authorName,
        categoryId,
        featuredImageUrl: body.featuredImageUrl,
        tagsJson:
          body.tagsJson === undefined
            ? undefined
            : body.tagsJson === null
              ? Prisma.DbNull
              : (body.tagsJson as Prisma.InputJsonValue),
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        isPublished,
        publishedAt,
        scheduledAt:
          body.scheduledAt === undefined
            ? undefined
            : body.scheduledAt
              ? new Date(body.scheduledAt)
              : null,
      },
      include: { category: true },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.blog_updated",
      entityType: "BlogPost",
      entityId: post.id,
    });
    return jsonOk({ post });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    await prisma.blogPost.delete({ where: { id } });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.blog_deleted",
      entityType: "BlogPost",
      entityId: id,
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
