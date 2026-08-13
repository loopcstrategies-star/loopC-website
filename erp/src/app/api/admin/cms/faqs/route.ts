import { z } from "zod";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/lib/http";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

const bodySchema = z.object({
  question: z.string().trim().min(3).max(500),
  answer: z.string().trim().min(1).max(5000),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  pageSlug: z.string().trim().min(1).max(80).optional(),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const faqs = await prisma.faqItem.findMany({
      orderBy: [{ pageSlug: "asc" }, { sortOrder: "asc" }],
    });
    return jsonOk({ faqs });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = bodySchema.parse(await req.json());
    const faq = await prisma.faqItem.create({
      data: {
        question: body.question,
        answer: body.answer,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
        pageSlug: body.pageSlug ?? "faq",
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.cms.faq_created",
      entityType: "FaqItem",
      entityId: faq.id,
    });
    return jsonOk({ faq }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
