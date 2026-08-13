import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";
import { slugify } from "@/lib/constants";

export const runtime = "nodejs";

const bodySchema = z.object({
  slug: z.string().trim().min(1).max(80).optional(),
  title: z.string().trim().min(1).max(200),
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

export async function GET() {
  try {
    await requireSuperAdmin();
    const [posts, categories] = await Promise.all([
      prisma.blogPost.findMany({
        include: { category: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      }),
      prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    ]);
    return jsonOk({ posts, categories });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = bodySchema.parse(await req.json());

    let categoryId = body.categoryId ?? null;
    if (!categoryId && body.categoryName) {
      const catSlug = slugify(body.categoryName);
      const category = await prisma.blogCategory.upsert({
        where: { slug: catSlug },
        create: { slug: catSlug, name: body.categoryName },
        update: { name: body.categoryName },
      });
      categoryId = category.id;
    }

    const isPublished = body.isPublished ?? false;
    const post = await prisma.blogPost.create({
      data: {
        slug: body.slug?.trim() || slugify(body.title),
        title: body.title,
        excerpt: body.excerpt ?? null,
        content: body.content ?? null,
        authorName: body.authorName ?? null,
        categoryId,
        featuredImageUrl: body.featuredImageUrl ?? null,
        tagsJson:
          body.tagsJson == null
            ? undefined
            : (body.tagsJson as Prisma.InputJsonValue),
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        isPublished,
        publishedAt: isPublished
          ? body.publishedAt
            ? new Date(body.publishedAt)
            : new Date()
          : body.publishedAt
            ? new Date(body.publishedAt)
            : null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
      include: { category: true },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.blog_created",
      entityType: "BlogPost",
      entityId: post.id,
    });
    return jsonOk({ post }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
