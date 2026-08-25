import { PageEditorClient } from "@/components/admin/cms/page-editor-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

async function ensurePage(slug: string, title: string) {
  return prisma.websitePage.upsert({
    where: { slug },
    create: { slug, title, status: "published" },
    update: {},
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });
}

export default async function AdminSolutionsPage() {
  await requireAdminSession();
  const page = await ensurePage("solutions", "Solutions");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Solutions Page</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Edit hero/intro copy for the public Solutions page. Solution cards remain catalog-driven
          with static fallbacks.
        </p>
      </div>
      <PageEditorClient page={page} pageLabel="Solutions" />
    </div>
  );
}
