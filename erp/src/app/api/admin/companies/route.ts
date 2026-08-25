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
  z.object({
    action: z.literal("update"),
    companyId: z.string().min(1),
    email: z.union([z.string().trim().email(), z.literal(""), z.null()]).optional(),
    phone: z.union([z.string().trim().max(64), z.null()]).optional(),
    address: z.union([z.string().trim().max(500), z.null()]).optional(),
    externalErpCustomerId: z.union([z.string().trim().max(200), z.null()]).optional(),
  }),
  z.object({
    action: z.literal("cancel"),
    companyId: z.string().min(1),
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

    if (body.action === "update") {
      const emptyToNull = (v: string | null | undefined) => {
        if (v == null) return null;
        const t = v.trim();
        return t.length ? t : null;
      };
      const company = await prisma.company.update({
        where: { id: body.companyId },
        data: {
          email: emptyToNull(body.email as string | null | undefined),
          phone: emptyToNull(body.phone),
          address: emptyToNull(body.address),
          externalErpCustomerId: emptyToNull(body.externalErpCustomerId),
        },
      });
      await writeAuditLog({
        actorId: session.user.id,
        companyId: body.companyId,
        action: "admin.company.update",
        entityType: "Company",
        entityId: body.companyId,
        metadata: {
          email: company.email,
          phone: company.phone,
          address: company.address,
          externalErpCustomerId: company.externalErpCustomerId,
        },
      });
      return jsonOk({ company });
    }

    if (body.action === "cancel") {
      const subscription = await BillingService.cancelSubscription({
        companyId: body.companyId,
        actorId: session.user.id,
        atPeriodEnd: false,
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
