import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const bodySchema = z.object({
  quote: z.string().trim().min(5).max(2000),
  authorName: z.string().trim().min(1).max(120),
  authorRole: z.string().trim().max(120).nullable().optional(),
  companyName: z.string().trim().max(160).nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return jsonOk({ testimonials });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = bodySchema.parse(await req.json());
    const testimonial = await prisma.testimonial.create({
      data: {
        quote: body.quote,
        authorName: body.authorName,
        authorRole: body.authorRole ?? null,
        companyName: body.companyName ?? null,
        rating: body.rating ?? null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.testimonial_created",
      entityType: "Testimonial",
      entityId: testimonial.id,
    });
    return jsonOk({ testimonial }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
