import { AdminCouponsClient } from "@/components/admin/coupons-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminCouponsPage() {
  await requireAdminSession();
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
      <AdminCouponsClient coupons={coupons} />
    </div>
  );
}
