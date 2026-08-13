import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const updateSchema = z.object({
  question: z.string().trim().min(3).max(500).optional(),
  answer: z.string().trim().min(1).max(5000).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  pageSlug: z.string().trim().min(1).max(80).optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());
    const existing = await prisma.faqItem.findUnique({ where: { id } });
    if (!existing) return jsonError("FAQ not found", 404);

    const faq = await prisma.faqItem.update({
      where: { id },
      data: body,
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.faq_updated",
      entityType: "FaqItem",
      entityId: faq.id,
    });
    return jsonOk({ faq });
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
    await prisma.faqItem.delete({ where: { id } });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.faq_deleted",
      entityType: "FaqItem",
      entityId: id,
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
