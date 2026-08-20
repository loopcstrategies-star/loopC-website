import { PageEditorClient } from "@/components/admin/cms/page-editor-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminErpProductPage() {
  await requireAdminSession();

  const page = await prisma.websitePage.findUnique({
    where: { slug: "erp" },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ERP Product Page</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Edit marketing content for the ERP product page. This controls the copy on the public /erp route.
          Do not add actual ERP business logic here — this is marketing content only.
        </p>
      </div>
      <PageEditorClient page={page} pageLabel="ERP Product" />
    </div>
  );
}
