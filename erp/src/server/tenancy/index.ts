import { prisma } from "@/server/db";
import { slugify } from "@/lib/constants";
import { writeAuditLog } from "@/server/audit";

async function uniqueCompanySlug(name: string): Promise<string> {
  const base = slugify(name) || "company";
  let candidate = base;
  let i = 0;
  while (await prisma.company.findUnique({ where: { slug: candidate } })) {
    i += 1;
    candidate = `${base}-${i}`.slice(0, 48);
  }
  return candidate;
}

/**
 * Creates a company and owner membership.
 * Copies the system `company_admin` role (and its permissions) into a
 * company-scoped role, then links the owner membership to that role.
 */
export async function createCompanyWithOwner(input: {
  userId: string;
  companyName: string;
  country?: string | null;
  employeeCount?: number | null;
}) {
  const systemAdmin = await prisma.role.findFirst({
    where: { companyId: null, key: "company_admin" },
    include: { rolePermissions: true },
  });

  if (!systemAdmin) {
    throw Object.assign(new Error("System company_admin role is missing; run db seed"), {
      code: "ROLE_MISSING",
    });
  }

  const slug = await uniqueCompanySlug(input.companyName);

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: input.companyName.trim(),
        slug,
        country: input.country ?? undefined,
        employeeCount: input.employeeCount ?? undefined,
        status: "active",
      },
    });

    const companyRole = await tx.role.create({
      data: {
        companyId: company.id,
        key: systemAdmin.key,
        name: systemAdmin.name,
        description: systemAdmin.description,
        isSystem: false,
      },
    });

    if (systemAdmin.rolePermissions.length > 0) {
      await tx.rolePermission.createMany({
        data: systemAdmin.rolePermissions.map((rp) => ({
          roleId: companyRole.id,
          permissionId: rp.permissionId,
        })),
      });
    }

    const membership = await tx.membership.create({
      data: {
        userId: input.userId,
        companyId: company.id,
        roleId: companyRole.id,
        isOwner: true,
      },
      include: {
        role: true,
        company: true,
      },
    });

    return { company, membership, role: companyRole };
  });

  await writeAuditLog({
    actorId: input.userId,
    companyId: result.company.id,
    action: "company.created",
    entityType: "Company",
    entityId: result.company.id,
    metadata: { slug: result.company.slug, name: result.company.name },
  });

  return result;
}

export async function getMembership(userId: string, companyId: string) {
  return prisma.membership.findUnique({
    where: {
      userId_companyId: { userId, companyId },
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
      company: true,
    },
  });
}

export async function listUserCompanies(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: {
      company: true,
      role: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return memberships.map((m) => ({
    membershipId: m.id,
    isOwner: m.isOwner,
    role: m.role,
    company: m.company,
  }));
}
