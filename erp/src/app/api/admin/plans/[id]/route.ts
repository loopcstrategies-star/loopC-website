import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const featureSchema = z.object({
  moduleKey: z.string().min(1),
  enabled: z.boolean().default(true),
  label: z.string().optional(),
});

const limitSchema = z.object({
  limitKey: z.string().min(1),
  value: z.number().int(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  monthlyPriceInr: z.number().int().nullable().optional(),
  yearlyPriceInr: z.number().int().nullable().optional(),
  isCustomPricing: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  supportLevel: z.string().optional(),
  trialEligible: z.boolean().optional(),
  features: z.array(featureSchema).optional(),
  limits: z.array(limitSchema).optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());

    const existing = await prisma.plan.findUnique({ where: { id } });
    if (!existing) return jsonError("Plan not found", 404);

    if (body.features) {
      await prisma.planFeature.deleteMany({ where: { planId: id } });
      await prisma.planFeature.createMany({
        data: body.features.map((f) => ({ ...f, planId: id })),
      });
    }
    if (body.limits) {
      await prisma.planLimit.deleteMany({ where: { planId: id } });
      await prisma.planLimit.createMany({
        data: body.limits.map((l) => ({ ...l, planId: id })),
      });
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description === null ? null : body.description,
        monthlyPriceInr: body.monthlyPriceInr,
        yearlyPriceInr: body.yearlyPriceInr,
        isCustomPricing: body.isCustomPricing,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
        supportLevel: body.supportLevel,
        trialEligible: body.trialEligible,
      },
      include: { features: true, limits: true },
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.plan_updated",
      entityType: "Plan",
      entityId: plan.id,
    });

    return jsonOk({ plan });
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
    const plan = await prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.plan_deactivated",
      entityType: "Plan",
      entityId: plan.id,
    });
    return jsonOk({ plan });
  } catch (err) {
    return handleRouteError(err);
  }
}
