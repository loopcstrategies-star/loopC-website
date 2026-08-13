import { z } from "zod";
import { CouponType } from "@prisma/client";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const createSchema = z.object({
  code: z.string().trim().min(2).max(40),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().int().positive(),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  validFrom: z.string().datetime().nullable().optional(),
  validUntil: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return jsonOk({ coupons });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = createSchema.parse(await req.json());
    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        type: body.type as CouponType,
        value: body.value,
        maxRedemptions: body.maxRedemptions ?? null,
        validFrom: body.validFrom ? new Date(body.validFrom) : null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        isActive: body.isActive ?? true,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.coupon_created",
      entityType: "Coupon",
      entityId: coupon.id,
    });
    return jsonOk({ coupon }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
