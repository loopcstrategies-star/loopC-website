import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/audit";
import { BillingService } from "@/server/billing/service";
import { handleRouteError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireSuperAdmin();
    const companies = await prisma.company.findMany({
      include: {
        subscription: { include: { plan: true } },
        _count: { select: { memberships: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return jsonOk({ companies });
  } catch (err) {
    return handleRouteError(err);
  }
}

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("suspend"),
    companyId: z.string().min(1),
  }),
  z.object({
    action: z.literal("activate"),
    companyId: z.string().min(1),
    planId: z.string().min(1).optional(),
  }),
  z.object({
    action: z.literal("note"),
    companyId: z.string().min(1),
    note: z.string().trim().min(1).max(2000),
  }),
]);

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = actionSchema.parse(await req.json());

    if (body.action === "suspend") {
      const subscription = await BillingService.adminSuspend({
        companyId: body.companyId,
        actorId: session.user.id,
      });
      return jsonOk({ companyId: body.companyId, subscription });
    }

    if (body.action === "activate") {
      const company = await prisma.company.findUnique({
        where: { id: body.companyId },
        include: { subscription: true },
      });
      if (!company) throw Object.assign(new Error("Company not found"), { code: "NOT_FOUND" });

      const planId = body.planId ?? company.subscription?.planId;
      if (!planId) {
        throw Object.assign(new Error("planId required to activate"), {
          code: "PLAN_REQUIRED",
        });
      }

      const subscription = await BillingService.adminActivate({
        companyId: body.companyId,
        planId,
        billingCycle: company.subscription?.billingCycle,
        actorId: session.user.id,
      });
      return jsonOk({ companyId: body.companyId, subscription });
    }

    await writeAuditLog({
      actorId: session.user.id,
      companyId: body.companyId,
      action: "admin.company.support_note",
      entityType: "Company",
      entityId: body.companyId,
      metadata: { note: body.note },
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
