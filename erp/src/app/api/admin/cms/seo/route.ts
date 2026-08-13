import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const bodySchema = z.object({
  pageSlug: z.string().trim().min(1).max(80),
  pageId: z.string().nullable().optional(),
  title: z.string().trim().max(200).nullable().optional(),
  description: z.string().trim().max(500).nullable().optional(),
  keywords: z.string().trim().max(400).nullable().optional(),
  canonicalUrl: z.string().trim().max(800).nullable().optional(),
  ogTitle: z.string().trim().max(200).nullable().optional(),
  ogDescription: z.string().trim().max(500).nullable().optional(),
  ogImageUrl: z.string().trim().max(800).nullable().optional(),
  robots: z.string().trim().max(80).nullable().optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const seo = await prisma.seoMetadata.findMany({
      orderBy: { pageSlug: "asc" },
      include: { page: { select: { id: true, title: true, slug: true } } },
    });
    return jsonOk({ seo });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = bodySchema.parse(await req.json());
    const record = await prisma.seoMetadata.upsert({
      where: { pageSlug: body.pageSlug },
      create: {
        pageSlug: body.pageSlug,
        pageId: body.pageId ?? null,
        title: body.title ?? null,
        description: body.description ?? null,
        keywords: body.keywords ?? null,
        canonicalUrl: body.canonicalUrl ?? null,
        ogTitle: body.ogTitle ?? null,
        ogDescription: body.ogDescription ?? null,
        ogImageUrl: body.ogImageUrl ?? null,
        robots: body.robots ?? "index,follow",
      },
      update: {
        pageId: body.pageId,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        canonicalUrl: body.canonicalUrl,
        ogTitle: body.ogTitle,
        ogDescription: body.ogDescription,
        ogImageUrl: body.ogImageUrl,
        robots: body.robots,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.seo_upserted",
      entityType: "SeoMetadata",
      entityId: record.id,
    });
    return jsonOk({ seo: record });
  } catch (err) {
    return handleRouteError(err);
  }
}
