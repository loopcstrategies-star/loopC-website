import { ServicesClient } from "@/components/admin/cms/services-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminServicesPage() {
  await requireAdminSession();
  const services = await prisma.cmsService.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
      <ServicesClient services={services} />
    </div>
  );
}
