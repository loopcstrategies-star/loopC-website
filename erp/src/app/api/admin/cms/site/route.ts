import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const updateSchema = z.object({
  siteName: z.string().trim().min(1).max(160).optional(),
  tagline: z.string().trim().max(300).nullable().optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  email: z.string().trim().email().nullable().optional(),
  address: z.string().trim().max(500).nullable().optional(),
  footerText: z.string().trim().max(500).nullable().optional(),
  socialJson: z.unknown().nullable().optional(),
  navJson: z.unknown().nullable().optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const site =
      (await prisma.siteSetting.findUnique({ where: { id: "default" } })) ??
      (await prisma.siteSetting.create({ data: { id: "default" } }));
    const home = await prisma.websitePage.findUnique({
      where: { slug: "home" },
      include: { sections: { orderBy: { sortOrder: "asc" } }, seo: true },
    });
    return jsonOk({ site, home });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = updateSchema.parse(await req.json());
    const site = await prisma.siteSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        siteName: body.siteName ?? "LoopC Business Strategies",
        tagline: body.tagline ?? undefined,
        phone: body.phone ?? undefined,
        email: body.email ?? undefined,
        address: body.address ?? undefined,
        footerText: body.footerText ?? undefined,
        socialJson:
          body.socialJson === undefined || body.socialJson === null
            ? undefined
            : (body.socialJson as Prisma.InputJsonValue),
        navJson:
          body.navJson === undefined || body.navJson === null
            ? undefined
            : (body.navJson as Prisma.InputJsonValue),
      },
      update: {
        siteName: body.siteName,
        tagline: body.tagline,
        phone: body.phone,
        email: body.email,
        address: body.address,
        footerText: body.footerText,
        socialJson:
          body.socialJson === undefined
            ? undefined
            : body.socialJson === null
              ? Prisma.DbNull
              : (body.socialJson as Prisma.InputJsonValue),
        navJson:
          body.navJson === undefined
            ? undefined
            : body.navJson === null
              ? Prisma.DbNull
              : (body.navJson as Prisma.InputJsonValue),
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.site_updated",
      entityType: "SiteSetting",
      entityId: "default",
    });
    return jsonOk({ site });
  } catch (err) {
    return handleRouteError(err);
  }
}
