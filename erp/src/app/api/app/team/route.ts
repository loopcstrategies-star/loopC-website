import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireSession } from "@/server/auth";
import { assertPermission } from "@/server/access/rbac";
import { assertWithinLimit } from "@/server/access/features";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";
import { AccessError } from "@/server/access/errors";

export const runtime = "nodejs";

const inviteSchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().min(2).max(120),
  roleKey: z
    .enum(["company_admin", "manager", "employee", "accountant"])
    .default("employee"),
  temporaryPassword: z.string().min(8).max(128).optional(),
});

export async function GET() {
  try {
    const session = await requireSession();
    const companyId = session.user.companyId;
    if (!companyId) return jsonError("No company", 400, "NO_COMPANY");

    await assertPermission(session.user.id, companyId, "team.view");

    const members = await prisma.membership.findMany({
      where: { companyId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        role: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return jsonOk({ members });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const companyId = session.user.companyId;
    if (!companyId) return jsonError("No company", 400, "NO_COMPANY");

    await assertPermission(session.user.id, companyId, "team.manage");
    await assertWithinLimit(companyId, "users", 1);

    const body = inviteSchema.parse(await req.json());
    const email = body.email.toLowerCase();
    const tempPassword =
      body.temporaryPassword ??
      `LoopC-${Math.random().toString(36).slice(2, 10)}A1`;
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const systemRole = await prisma.role.findFirst({
      where: { companyId: null, key: body.roleKey },
      include: { rolePermissions: true },
    });
    if (!systemRole) {
      return jsonError("Role template missing — run db seed", 500, "ROLE_MISSING");
    }

    const result = await prisma.$transaction(async (tx) => {
      let companyRole = await tx.role.findFirst({
        where: { companyId, key: body.roleKey },
      });

      if (!companyRole) {
        companyRole = await tx.role.create({
          data: {
            companyId,
            key: systemRole.key,
            name: systemRole.name,
            description: systemRole.description,
            isSystem: false,
          },
        });
        if (systemRole.rolePermissions.length > 0) {
          await tx.rolePermission.createMany({
            data: systemRole.rolePermissions.map((rp) => ({
              roleId: companyRole!.id,
              permissionId: rp.permissionId,
            })),
          });
        }
      }

      const used = await tx.membership.count({ where: { companyId } });
      const sub = await tx.subscription.findUnique({
        where: { companyId },
        include: { plan: { include: { limits: true } } },
      });
      const limit =
        sub?.plan.limits.find((l) => l.limitKey === "users")?.value ?? null;
      if (limit != null && used + 1 > limit) {
        throw new AccessError(
          "LIMIT_EXCEEDED",
          `Limit "users" exceeded (${used + 1}/${limit})`,
          { limitKey: "users", used, limit },
        );
      }

      let user = await tx.user.findUnique({ where: { email } });
      let createdUser = false;
      if (!user) {
        user = await tx.user.create({
          data: {
            email,
            name: body.name,
            passwordHash,
          },
        });
        createdUser = true;
      }

      const existing = await tx.membership.findUnique({
        where: { userId_companyId: { userId: user.id, companyId } },
      });
      if (existing) {
        throw Object.assign(new Error("User is already a member"), {
          code: "ALREADY_MEMBER",
        });
      }

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          companyId,
          roleId: companyRole.id,
          isOwner: false,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          role: true,
        },
      });

      return { membership, createdUser };
    });

    await writeAuditLog({
      actorId: session.user.id,
      companyId,
      action: "team.member_added",
      entityType: "Membership",
      entityId: result.membership.id,
      metadata: { email, roleKey: body.roleKey },
    });

    return jsonOk({
      ok: true,
      member: result.membership,
      temporaryPassword: result.createdUser ? tempPassword : undefined,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
