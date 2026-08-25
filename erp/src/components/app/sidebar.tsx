import Link from "next/link";
import { Badge, subscriptionTone } from "@/components/ui/badge";
import { getExternalErpUrl } from "@/lib/external-erp";

const NAV = [
  { href: "/app", label: "Account" },
  { href: "/app/billing", label: "Billing" },
  { href: "/app/team", label: "Team" },
  { href: "/app/settings", label: "Settings" },
];

export function AppSidebar({
  companyName,
  subscriptionStatus,
  planName,
  isSuperAdmin,
  accessReady,
}: {
  companyName: string;
  subscriptionStatus: string | null;
  planName: string | null;
  isSuperAdmin: boolean;
  accessReady: boolean;
}) {
  const erpUrl = getExternalErpUrl();

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:w-64">
      <div className="border-b border-[var(--border)] p-4">
        <Link href="/app" className="brand-mark text-lg">
          LoopC Account
        </Link>
        <p className="mt-1 truncate text-sm text-[var(--muted)]">{companyName}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {subscriptionStatus && (
            <Badge tone={subscriptionTone(subscriptionStatus)}>{subscriptionStatus}</Badge>
          )}
          {planName && <Badge>{planName}</Badge>}
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-3 text-sm">
        <div className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-[var(--ink)] hover:bg-[var(--surface-2)]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Product
          </p>
          {accessReady ? (
            <a
              href={erpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block rounded-md px-3 py-2 font-medium text-[var(--accent)] hover:bg-[var(--surface-2)]"
            >
              Open ERP →
            </a>
          ) : (
            <Link
              href="/pricing"
              className="mt-1 block rounded-md px-3 py-2 font-medium text-[var(--accent)] hover:bg-[var(--surface-2)]"
            >
              Choose a plan
            </Link>
          )}
          <p className="mt-1 px-3 text-xs text-[var(--muted)]">
            {accessReady
              ? "Opens the existing LoopC ERP product (separate from this portal)."
              : "Activate a subscription to unlock product access."}
          </p>
        </div>

        {isSuperAdmin && (
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Admin
            </p>
            <Link
              href="/admin"
              className="mt-1 block rounded-md px-3 py-2 text-[var(--ink)] hover:bg-[var(--surface-2)]"
            >
              Super admin
            </Link>
          </div>
        )}
      </nav>

      <div className="border-t border-[var(--border)] p-3 text-xs text-[var(--muted)]">
        Subscription &amp; billing portal
      </div>
    </aside>
  );
}
