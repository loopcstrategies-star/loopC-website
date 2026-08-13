import { SeoClient } from "@/components/admin/cms/seo-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminSeoPage() {
  await requireAdminSession();
  const seo = await prisma.seoMetadata.findMany({
    orderBy: { pageSlug: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">SEO</h1>
      <SeoClient seo={seo} />
    </div>
  );
}
