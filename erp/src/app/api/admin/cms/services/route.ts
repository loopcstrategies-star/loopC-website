import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";
import { slugify } from "@/lib/constants";

export const runtime = "nodejs";

const bodySchema = z.object({
  slug: z.string().trim().min(1).max(80).optional(),
  name: z.string().trim().min(1).max(160),
  summary: z.string().trim().max(500).nullable().optional(),
  description: z.string().nullable().optional(),
  icon: z.string().trim().max(80).nullable().optional(),
  imageUrl: z.string().trim().max(800).nullable().optional(),
  featuresJson: z.unknown().nullable().optional(),
  ctaLabel: z.string().trim().max(80).nullable().optional(),
  ctaHref: z.string().trim().max(400).nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const services = await prisma.cmsService.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return jsonOk({ services });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = bodySchema.parse(await req.json());
    const service = await prisma.cmsService.create({
      data: {
        slug: body.slug?.trim() || slugify(body.name),
        name: body.name,
        summary: body.summary ?? null,
        description: body.description ?? null,
        icon: body.icon ?? null,
        imageUrl: body.imageUrl ?? null,
        featuresJson:
          body.featuresJson == null
            ? undefined
            : (body.featuresJson as Prisma.InputJsonValue),
        ctaLabel: body.ctaLabel ?? null,
        ctaHref: body.ctaHref ?? null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.service_created",
      entityType: "CmsService",
      entityId: service.id,
    });
    return jsonOk({ service }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
