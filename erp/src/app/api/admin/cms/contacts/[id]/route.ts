import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const updateSchema = z.object({
  status: z.enum(["new", "in_progress", "contacted", "converted", "closed", "spam"]).optional(),
  internalNotes: z.string().max(5000).nullable().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());
    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
    });
    if (!existing) return jsonError("Submission not found", 404);

    const contact = await prisma.contactSubmission.update({
      where: { id },
      data: {
        status: body.status,
        internalNotes: body.internalNotes,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.contact_updated",
      entityType: "ContactSubmission",
      entityId: contact.id,
    });
    return jsonOk({ contact });
  } catch (err) {
    return handleRouteError(err);
  }
}
