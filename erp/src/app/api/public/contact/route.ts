import { z } from "zod";
import { prisma } from "@/server/db";
import { rateLimit } from "@/server/rate-limit";
import { writeAuditLog } from "@/server/audit";
import { handleRouteError } from "@/lib/http";
import {
  jsonErrorPublic,
  jsonOkPublic,
  publicCorsPreflight,
  withPublicCors,
} from "@/lib/cors";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(32).optional().nullable(),
  company: z.string().trim().max(160).optional().nullable(),
  service: z.string().trim().max(160).optional().nullable(),
  message: z.string().trim().min(10).max(5000),
});

export async function OPTIONS() {
  return publicCorsPreflight();
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const limited = rateLimit(`website.contact:${ip}`, 5, 60_000);
    if (!limited.success) {
      return jsonErrorPublic("Too many requests", 429, "RATE_LIMITED");
    }

    const body = contactSchema.parse(await req.json());

    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone || null,
        company: body.company || null,
        service: body.service || null,
        message: body.message,
      },
    });

    await writeAuditLog({
      action: "website.contact",
      entityType: "ContactSubmission",
      entityId: submission.id,
      ip,
      metadata: {
        email: submission.email,
        service: submission.service,
      },
    });

    const { notifyAdminOfContact } = await import(
      "@/server/notifications/contact"
    );
    await notifyAdminOfContact({
      submissionId: submission.id,
      name: submission.name,
      email: submission.email,
      service: submission.service,
      ip,
    });

    return jsonOkPublic({ ok: true });
  } catch (err) {
    return withPublicCors(handleRouteError(err));
  }
}
