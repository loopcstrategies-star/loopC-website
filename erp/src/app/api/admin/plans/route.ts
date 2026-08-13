import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";
import { slugify } from "@/lib/constants";

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

const planBodySchema = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(1),
  description: z.string().optional(),
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

export async function GET() {
  try {
    await requireSuperAdmin();
    const plans = await prisma.plan.findMany({
      include: { features: true, limits: true },
      orderBy: { sortOrder: "asc" },
    });
    return jsonOk({ plans });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = planBodySchema.parse(await req.json());
    const slug = body.slug?.trim() || slugify(body.name);

    const plan = await prisma.plan.create({
      data: {
        slug,
        name: body.name,
        description: body.description,
        monthlyPriceInr: body.monthlyPriceInr ?? null,
        yearlyPriceInr: body.yearlyPriceInr ?? null,
        isCustomPricing: body.isCustomPricing ?? false,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
        supportLevel: body.supportLevel ?? "email",
        trialEligible: body.trialEligible ?? true,
        features: body.features
          ? { create: body.features }
          : undefined,
        limits: body.limits ? { create: body.limits } : undefined,
      },
      include: { features: true, limits: true },
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.plan_created",
      entityType: "Plan",
      entityId: plan.id,
    });

    return jsonOk({ plan }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
