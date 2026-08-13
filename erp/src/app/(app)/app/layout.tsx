import Link from "next/link";
import { SignOutButton } from "@/components/app/sign-out-button";
import { AppSidebar } from "@/components/app/sidebar";
import { ResponsiveSidebarLayout } from "@/components/ui/responsive-sidebar-layout";
import { requireAppSession } from "@/lib/session-guards";
import { getEnabledModules } from "@/server/access/features";
import { getCompanySubscription } from "@/server/access/subscription";
import { prisma } from "@/server/db";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAppSession();
  const companyId = session.user.companyId;

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  const subscription = await getCompanySubscription(companyId);

  let enabledModules: string[] = [];
  try {
    enabledModules = await getEnabledModules(companyId);
  } catch {
    enabledModules = [];
  }

  const displayName = session.user.name || session.user.email;

  return (
    <ResponsiveSidebarLayout
      sidebar={
        <AppSidebar
          companyName={company?.name ?? "Company"}
          enabledModules={enabledModules}
          subscriptionStatus={subscription?.status ?? null}
          planName={subscription?.plan.name ?? null}
          isSuperAdmin={session.user.isSuperAdmin}
        />
      }
      title={
        <>
          <span className="hidden sm:inline">Signed in as </span>
          {displayName}
        </>
      }
      headerActions={
        <>
          <Link
            href="/pricing"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Plans
          </Link>
          <SignOutButton />
        </>
      }
    >
      {children}
    </ResponsiveSidebarLayout>
  );
}
