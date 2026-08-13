import { prisma } from "@/server/db";
import { AccessError } from "@/server/access/errors";

export async function assertPermission(
  userId: string,
  companyId: string,
  permissionKey: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isSuperAdmin: true },
  });

  if (!user) {
    throw new AccessError("USER_NOT_FOUND", "User not found");
  }

  if (user.isSuperAdmin) {
    return true;
  }

  const membership = await prisma.membership.findUnique({
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
    },
  });

  if (!membership) {
    throw new AccessError("NOT_A_MEMBER", "User is not a member of this company");
  }

  const allowed = membership.role.rolePermissions.some(
    (rp) => rp.permission.key === permissionKey,
  );

  if (!allowed) {
    throw new AccessError(
      "PERMISSION_DENIED",
      `Missing permission "${permissionKey}"`,
    );
  }

  return true;
}
