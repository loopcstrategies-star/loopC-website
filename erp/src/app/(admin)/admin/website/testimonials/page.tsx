import { TestimonialsClient } from "@/components/admin/cms/testimonials-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminTestimonialsPage() {
  await requireAdminSession();
  const items = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
      <TestimonialsClient items={items} />
    </div>
  );
}
