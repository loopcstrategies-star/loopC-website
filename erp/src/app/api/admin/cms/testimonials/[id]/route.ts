import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const updateSchema = z.object({
  quote: z.string().trim().min(5).max(2000).optional(),
  authorName: z.string().trim().min(1).max(120).optional(),
  authorRole: z.string().trim().max(120).nullable().optional(),
  companyName: z.string().trim().max(160).nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return jsonError("Testimonial not found", 404);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.testimonial_updated",
      entityType: "Testimonial",
      entityId: testimonial.id,
    });
    return jsonOk({ testimonial });
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
    await prisma.testimonial.delete({ where: { id } });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.testimonial_deleted",
      entityType: "Testimonial",
      entityId: id,
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
