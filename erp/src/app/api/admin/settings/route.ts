import { DowngradeMode } from "@prisma/client";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const updateSchema = z.object({
  trialEnabled: z.boolean().optional(),
  trialDays: z.number().int().positive().optional(),
  trialRequiresPayment: z.boolean().optional(),
  gracePeriodDays: z.number().int().positive().optional(),
  downgradeMode: z.enum(["NEXT_CYCLE", "IMMEDIATE"]).optional(),
  retentionDays: z.number().int().positive().optional(),
  taxPercent: z.number().int().min(0).max(100).optional(),
  currency: z.string().min(3).max(3).optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const settings =
      (await prisma.billingSettings.findUnique({ where: { id: "default" } })) ??
      (await prisma.billingSettings.create({ data: { id: "default" } }));
    return jsonOk({ settings });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = updateSchema.parse(await req.json());
    const settings = await prisma.billingSettings.upsert({
      where: { id: "default" },
      create: { id: "default", ...body, downgradeMode: body.downgradeMode as DowngradeMode | undefined },
      update: {
        ...body,
        downgradeMode: body.downgradeMode as DowngradeMode | undefined,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.settings_updated",
      entityType: "BillingSettings",
      entityId: "default",
    });
    return jsonOk({ settings });
  } catch (err) {
    return handleRouteError(err);
  }
}
