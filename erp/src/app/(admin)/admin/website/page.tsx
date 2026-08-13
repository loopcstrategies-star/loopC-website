import { WebsiteHomeClient } from "@/components/admin/cms/website-home-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminWebsitePage() {
  await requireAdminSession();

  const site =
    (await prisma.siteSetting.findUnique({ where: { id: "default" } })) ??
    (await prisma.siteSetting.create({ data: { id: "default" } }));

  const home = await prisma.websitePage.findUnique({
    where: { slug: "home" },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Website</h1>
      <WebsiteHomeClient site={site} home={home} />
    </div>
  );
}
