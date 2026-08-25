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

export default async function AdminIndustriesPage() {
  await requireAdminSession();
  const page = await ensurePage("industries", "Industries");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Industries Page</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Edit hero/intro copy for the public Industries index. Industry detail pages stay on the
          static catalog.
        </p>
      </div>
      <PageEditorClient page={page} pageLabel="Industries" />
    </div>
  );
}
