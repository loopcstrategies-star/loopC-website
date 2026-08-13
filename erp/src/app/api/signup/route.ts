import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/server/db";
import { createCompanyWithOwner } from "@/server/tenancy";
import { BillingService } from "@/server/billing/service";
import { rateLimit } from "@/server/rate-limit";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const signupSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(32).optional(),
  password: z.string().min(8).max(128),
  country: z.string().trim().min(2).max(8).optional(),
  employees: z.coerce.number().int().min(1).max(1_000_000).optional(),
  planSlug: z.string().trim().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const limited = rateLimit(
      `signup:${req.headers.get("x-forwarded-for") ?? "unknown"}`,
      10,
      60_000,
    );
    if (!limited.success) return jsonError("Too many requests", 429);

    const body = signupSchema.parse(await req.json());
    const email = body.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return jsonError("Email already registered", 409, "EMAIL_TAKEN");

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: body.name,
        phone: body.phone,
        country: body.country,
      },
    });

    const { company } = await createCompanyWithOwner({
      userId: user.id,
      companyName: body.companyName,
      country: body.country,
      employeeCount: body.employees,
    });

    let enterprise = false;
    let trialStarted = false;

    if (body.planSlug) {
      const plan = await prisma.plan.findUnique({ where: { slug: body.planSlug } });
      if (plan?.isCustomPricing) {
        enterprise = true;
      } else if (plan?.isActive && plan.trialEligible) {
        const settings = await prisma.billingSettings.findUnique({
          where: { id: "default" },
        });
        if (settings?.trialEnabled && !settings.trialRequiresPayment) {
          await BillingService.startTrial({
            companyId: company.id,
            planId: plan.id,
            actorId: user.id,
          });
          trialStarted = true;
        }
      }
    }

    await writeAuditLog({
      actorId: user.id,
      companyId: company.id,
      action: "auth.signup",
      entityType: "User",
      entityId: user.id,
    });

    return jsonOk({
      ok: true,
      userId: user.id,
      companyId: company.id,
      enterprise,
      trialStarted,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
