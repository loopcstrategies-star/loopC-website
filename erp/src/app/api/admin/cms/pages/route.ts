import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";
import { slugify } from "@/lib/constants";

export const runtime = "nodejs";

const createSchema = z.object({
  slug: z.string().trim().min(1).max(80).optional(),
  title: z.string().trim().min(1).max(200),
  status: z.enum(["draft", "published"]).optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const pages = await prisma.websitePage.findMany({
      include: {
        sections: { orderBy: { sortOrder: "asc" } },
        seo: true,
        _count: { select: { sections: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return jsonOk({ pages });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = createSchema.parse(await req.json());
    const slug = body.slug?.trim() || slugify(body.title);
    const page = await prisma.websitePage.create({
      data: {
        slug,
        title: body.title,
        status: body.status ?? "draft",
      },
      include: { sections: true, seo: true },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.page_created",
      entityType: "WebsitePage",
      entityId: page.id,
    });
    return jsonOk({ page }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
