import { ContactsClient } from "@/components/admin/cms/contacts-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminContactsPage() {
  await requireAdminSession();
  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
      <ContactsClient contacts={contacts} />
    </div>
  );
}
