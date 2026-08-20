import { PageEditorClient } from "@/components/admin/cms/page-editor-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminAboutPage() {
  await requireAdminSession();

  const page = await prisma.websitePage.findUnique({
    where: { slug: "about" },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">About Page</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Edit sections for the public About page. Changes appear on the website after saving.
        </p>
      </div>
      <PageEditorClient page={page} pageLabel="About" />
    </div>
  );
}
