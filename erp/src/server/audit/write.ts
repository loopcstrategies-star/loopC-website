import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";

export async function writeAuditLog(input: {
  actorId?: string | null;
  companyId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? undefined,
      companyId: input.companyId ?? undefined,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata:
        input.metadata === undefined
          ? undefined
          : (input.metadata as Prisma.InputJsonValue),
      ip: input.ip ?? undefined,
    },
  });
}
