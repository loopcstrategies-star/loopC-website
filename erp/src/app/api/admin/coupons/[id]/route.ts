import { z } from "zod";
import { CouponType } from "@prisma/client";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const updateSchema = z.object({
  type: z.enum(["PERCENT", "FIXED"]).optional(),
  value: z.number().int().positive().optional(),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  validFrom: z.string().datetime().nullable().optional(),
  validUntil: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        type: body.type as CouponType | undefined,
        value: body.value,
        maxRedemptions: body.maxRedemptions,
        validFrom:
          body.validFrom === undefined
            ? undefined
            : body.validFrom
              ? new Date(body.validFrom)
              : null,
        validUntil:
          body.validUntil === undefined
            ? undefined
            : body.validUntil
              ? new Date(body.validUntil)
              : null,
        isActive: body.isActive,
      },
    });
    return jsonOk({ coupon });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin();
    const { id } = await ctx.params;
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) return jsonError("Coupon not found", 404);
    const coupon = await prisma.coupon.update({
      where: { id },
      data: { isActive: false },
    });
    return jsonOk({ coupon });
  } catch (err) {
    return handleRouteError(err);
  }
}
