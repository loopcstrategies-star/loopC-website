import { FaqsClient } from "@/components/admin/cms/faqs-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminFaqsPage() {
  await requireAdminSession();
  const faqs = await prisma.faqItem.findMany({
    orderBy: [{ pageSlug: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">FAQs</h1>
      <FaqsClient faqs={faqs} />
    </div>
  );
}
