import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const sectionInput = z.object({
  id: z.string().optional(),
  key: z.string().trim().min(1).max(80),
  title: z.string().trim().max(200).nullable().optional(),
  subtitle: z.string().trim().max(400).nullable().optional(),
  body: z.string().nullable().optional(),
  ctaLabel: z.string().trim().max(80).nullable().optional(),
  ctaHref: z.string().trim().max(400).nullable().optional(),
  imageUrl: z.string().trim().max(800).nullable().optional(),
  sortOrder: z.number().int().optional(),
  contentJson: z.unknown().nullable().optional(),
  isVisible: z.boolean().optional(),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  status: z.enum(["draft", "published"]).optional(),
  slug: z.string().trim().min(1).max(80).optional(),
  sections: z.array(sectionInput).optional(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin();
    const { id } = await ctx.params;
    const page = await prisma.websitePage.findUnique({
      where: { id },
      include: {
        sections: { orderBy: { sortOrder: "asc" } },
        seo: true,
      },
    });
    if (!page) return jsonError("Page not found", 404);
    return jsonOk({ page });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    const body = updateSchema.parse(await req.json());

    const existing = await prisma.websitePage.findUnique({ where: { id } });
    if (!existing) return jsonError("Page not found", 404);

    if (body.sections) {
      const keepIds = body.sections
        .map((s) => s.id)
        .filter((sectionId): sectionId is string => Boolean(sectionId));

      await prisma.websiteSection.deleteMany({
        where: {
          pageId: id,
          ...(keepIds.length > 0 ? { id: { notIn: keepIds } } : {}),
        },
      });

      for (const [index, section] of body.sections.entries()) {
        const data = {
          key: section.key,
          title: section.title ?? null,
          subtitle: section.subtitle ?? null,
          body: section.body ?? null,
          ctaLabel: section.ctaLabel ?? null,
          ctaHref: section.ctaHref ?? null,
          imageUrl: section.imageUrl ?? null,
          sortOrder: section.sortOrder ?? index,
          isVisible: section.isVisible ?? true,
          contentJson:
            section.contentJson === undefined
              ? undefined
              : section.contentJson === null
                ? Prisma.DbNull
                : (section.contentJson as Prisma.InputJsonValue),
        };
        if (section.id) {
          await prisma.websiteSection.updateMany({
            where: { id: section.id, pageId: id },
            data,
          });
        } else {
          await prisma.websiteSection.create({
            data: { ...data, pageId: id },
          });
        }
      }
    }

    const page = await prisma.websitePage.update({
      where: { id },
      data: {
        title: body.title,
        status: body.status,
        slug: body.slug,
      },
      include: {
        sections: { orderBy: { sortOrder: "asc" } },
        seo: true,
      },
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.page_updated",
      entityType: "WebsitePage",
      entityId: page.id,
    });

    return jsonOk({ page });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await ctx.params;
    await prisma.websitePage.delete({ where: { id } });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.page_deleted",
      entityType: "WebsitePage",
      entityId: id,
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
