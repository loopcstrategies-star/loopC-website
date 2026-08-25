import Link from "next/link";
import { SignOutButton } from "@/components/app/sign-out-button";
import { AppSidebar } from "@/components/app/sidebar";
import { ResponsiveSidebarLayout } from "@/components/ui/responsive-sidebar-layout";
import { getExternalErpUrl } from "@/lib/external-erp";
import { requireAppSession } from "@/lib/session-guards";
import { getCompanySubscription, isErpAccessReady } from "@/server/access/subscription";
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
  const displayName = session.user.name || session.user.email;
  const erpUrl = getExternalErpUrl();
  const accessReady = isErpAccessReady(subscription);

  return (
    <ResponsiveSidebarLayout
      sidebar={
        <AppSidebar
          companyName={company?.name ?? "Company"}
          subscriptionStatus={subscription?.status ?? null}
          planName={subscription?.plan.name ?? null}
          isSuperAdmin={session.user.isSuperAdmin}
          accessReady={accessReady}
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
          {accessReady ? (
            <a
              href={erpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Open ERP
            </a>
          ) : (
            <Link
              href="/pricing"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Choose a plan
            </Link>
          )}
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
