import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ResponsiveSidebarLayout } from "@/components/ui/responsive-sidebar-layout";
import { requireAdminSession } from "@/lib/session-guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="admin-shell min-h-full">
      <ResponsiveSidebarLayout sidebar={<AdminSidebar />} title="LoopC Admin" variant="admin">
        {children}
      </ResponsiveSidebarLayout>
    </div>
  );
}
