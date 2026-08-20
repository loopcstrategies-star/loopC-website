import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/audit";
import { handleRouteError } from "@/lib/http";

export const runtime = "nodejs";

const bodySchema = z.object({
  isSuperAdmin: z.boolean(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = bodySchema.parse(await req.json());

    if (id === session.user.id && body.isSuperAdmin === false) {
      return NextResponse.json(
        { error: "You cannot revoke your own super-admin access." },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isSuperAdmin: body.isSuperAdmin },
      select: { id: true, email: true, isSuperAdmin: true },
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: body.isSuperAdmin ? "admin.user.promote" : "admin.user.demote",
      entityType: "User",
      entityId: user.id,
      metadata: { email: user.email, isSuperAdmin: user.isSuperAdmin },
    });

    return NextResponse.json({ user });
  } catch (err) {
    return handleRouteError(err);
  }
}
