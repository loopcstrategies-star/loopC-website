import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const updateSchema = z.object({
  slug: z.string().trim().min(1).max(80).optional(),
  name: z.string().trim().min(1).max(160).optional(),
  summary: z.string().trim().max(500).nullable().optional(),
  description: z.string().nullable().optional(),
  icon: z.string().trim().max(80).nullable().optional(),
  imageUrl: z.string().trim().max(800).nullable().optional(),
  featuresJson: z.unknown().nullable().optional(),
  ctaLabel: z.string().trim().max(80).nullable().optional(),
  ctaHref: z.string().trim().max(400).nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());
    const existing = await prisma.cmsService.findUnique({ where: { id } });
    if (!existing) return jsonError("Service not found", 404);

    const service = await prisma.cmsService.update({
      where: { id },
      data: {
        slug: body.slug,
        name: body.name,
        summary: body.summary,
        description: body.description,
        icon: body.icon,
        imageUrl: body.imageUrl,
        featuresJson:
          body.featuresJson === undefined
            ? undefined
            : body.featuresJson === null
              ? Prisma.DbNull
              : (body.featuresJson as Prisma.InputJsonValue),
        ctaLabel: body.ctaLabel,
        ctaHref: body.ctaHref,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.service_updated",
      entityType: "CmsService",
      entityId: service.id,
    });
    return jsonOk({ service });
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
    await prisma.cmsService.delete({ where: { id } });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.service_deleted",
      entityType: "CmsService",
      entityId: id,
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
