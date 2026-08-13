import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const updateSchema = z.object({
  pageSlug: z.string().trim().min(1).max(80).optional(),
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

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());
    const existing = await prisma.seoMetadata.findUnique({ where: { id } });
    if (!existing) return jsonError("SEO record not found", 404);

    const seo = await prisma.seoMetadata.update({
      where: { id },
      data: body,
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.seo_updated",
      entityType: "SeoMetadata",
      entityId: seo.id,
    });
    return jsonOk({ seo });
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
    await prisma.seoMetadata.delete({ where: { id } });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.seo_deleted",
      entityType: "SeoMetadata",
      entityId: id,
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
