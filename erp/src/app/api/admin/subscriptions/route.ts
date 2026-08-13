import { z } from "zod";
import { BillingCycle, SubscriptionStatus } from "@prisma/client";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { BillingService } from "@/server/billing/service";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await requireSuperAdmin();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const companyId = url.searchParams.get("companyId");

    const subscriptions = await prisma.subscription.findMany({
      where: {
        ...(status ? { status: status as SubscriptionStatus } : {}),
        ...(companyId ? { companyId } : {}),
      },
      include: {
        company: true,
        plan: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });
    return jsonOk({ subscriptions });
  } catch (err) {
    return handleRouteError(err);
  }
}

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("activate"),
    companyId: z.string().min(1),
    planId: z.string().min(1),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]).optional(),
  }),
  z.object({
    action: z.literal("suspend"),
    companyId: z.string().min(1),
  }),
  z.object({
    action: z.literal("extend"),
    companyId: z.string().min(1),
    days: z.number().int().positive(),
  }),
  z.object({
    action: z.literal("trial"),
    companyId: z.string().min(1),
    planId: z.string().min(1),
    days: z.number().int().positive().optional(),
  }),
]);

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = actionSchema.parse(await req.json());

    if (body.action === "activate") {
      const subscription = await BillingService.adminActivate({
        companyId: body.companyId,
        planId: body.planId,
        billingCycle: body.billingCycle as BillingCycle | undefined,
        actorId: session.user.id,
      });
      return jsonOk({ subscription });
    }
    if (body.action === "suspend") {
      const subscription = await BillingService.adminSuspend({
        companyId: body.companyId,
        actorId: session.user.id,
      });
      return jsonOk({ subscription });
    }
    if (body.action === "extend") {
      const subscription = await BillingService.adminExtend({
        companyId: body.companyId,
        days: body.days,
        actorId: session.user.id,
      });
      return jsonOk({ subscription });
    }
    if (body.action === "trial") {
      const subscription = await BillingService.adminGrantTrial({
        companyId: body.companyId,
        planId: body.planId,
        days: body.days,
        actorId: session.user.id,
      });
      return jsonOk({ subscription });
    }

    return jsonError("Unknown action", 400);
  } catch (err) {
    return handleRouteError(err);
  }
}
