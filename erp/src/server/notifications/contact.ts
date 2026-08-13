import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/audit";

/**
 * Best-effort admin notify for website contact enquiries.
 * Uses email templates when EMAIL_PROVIDER is configured; always audits.
 */
export async function notifyAdminOfContact(input: {
  submissionId: string;
  name: string;
  email: string;
  service: string | null;
  ip?: string;
}) {
  const admins = await prisma.user.findMany({
    where: { isSuperAdmin: true },
    select: { id: true, email: true },
    take: 20,
  });

  const template = await prisma.emailTemplate.findUnique({
    where: { key: "contact_enquiry" },
  });

  const subject =
    template?.subject ??
    `New website enquiry from ${input.name}`;
  const body =
    template?.bodyHtml ??
    `<p>New enquiry from <strong>${input.name}</strong> (${input.email}).</p>
     <p>Service: ${input.service ?? "n/a"}</p>
     <p>Open Admin → Website CMS → Contacts to review.</p>`;

  const provider = process.env.EMAIL_PROVIDER?.trim();
  if (provider && process.env.EMAIL_API_KEY) {
    // Provider adapters can be plugged here (Resend, SES, etc.)
    console.info("[notify]", {
      provider,
      to: admins.map((a) => a.email),
      subject,
      preview: body.slice(0, 120),
    });
  } else {
    console.info("[notify:dev]", {
      to: admins.map((a) => a.email),
      subject,
      submissionId: input.submissionId,
    });
  }

  await writeAuditLog({
    action: "website.contact.notify_admin",
    entityType: "ContactSubmission",
    entityId: input.submissionId,
    ip: input.ip,
    metadata: {
      adminCount: admins.length,
      email: input.email,
      service: input.service,
      emailed: Boolean(provider && process.env.EMAIL_API_KEY),
    },
  });
}
