import Link from "next/link";
import { MODULE_CATALOG } from "@/lib/constants";
import { Badge, subscriptionTone } from "@/components/ui/badge";

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/billing", label: "Billing" },
  { href: "/app/team", label: "Team" },
  { href: "/app/settings", label: "Settings" },
];

const MODULE_NAV = [
  { key: "accounting", href: "/app/accounting", label: "Accounting" },
  { key: "invoicing", href: "/app/invoicing", label: "Invoicing" },
  { key: "sales", href: "/app/sales", label: "Sales" },
  { key: "purchasing", href: "/app/purchasing", label: "Purchasing" },
  { key: "inventory", href: "/app/inventory", label: "Inventory" },
  { key: "crm", href: "/app/crm", label: "CRM" },
  { key: "expenses", href: "/app/expenses", label: "Expenses" },
  { key: "reports", href: "/app/reports", label: "Reports", aliases: ["reports_basic", "reports_advanced"] },
  { key: "hr", href: "/app/hr", label: "HR" },
  { key: "payroll", href: "/app/payroll", label: "Payroll" },
  { key: "projects", href: "/app/projects", label: "Projects" },
  { key: "api", href: "/app/api-keys", label: "API keys" },
] as const;

export function AppSidebar({
  companyName,
  enabledModules,
  subscriptionStatus,
  planName,
  isSuperAdmin,
}: {
  companyName: string;
  enabledModules: string[];
  subscriptionStatus: string | null;
  planName: string | null;
  isSuperAdmin: boolean;
}) {
  const enabled = new Set(enabledModules);

  function moduleUnlocked(item: (typeof MODULE_NAV)[number]) {
    if (enabled.has(item.key)) return true;
    if ("aliases" in item && item.aliases) {
      return item.aliases.some((a) => enabled.has(a));
    }
    return false;
  }

  const unlocked = MODULE_NAV.filter(moduleUnlocked);
  const locked = MODULE_NAV.filter((item) => !moduleUnlocked(item));

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:w-64">
      <div className="border-b border-[var(--border)] p-4">
        <Link href="/app" className="brand-mark text-lg">
          LoopC ERP
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
            Modules
          </p>
          <div className="mt-1 space-y-1">
            {unlocked.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-[var(--ink)] hover:bg-[var(--surface-2)]"
              >
                {item.label}
              </Link>
            ))}
            {unlocked.length === 0 && (
              <p className="px-3 py-2 text-[var(--muted)]">
                No modules unlocked yet.{" "}
                <Link href="/pricing" className="text-[var(--accent)] hover:underline">
                  Choose a plan
                </Link>
              </p>
            )}
          </div>
        </div>

        {locked.length > 0 && (
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Locked
            </p>
            <div className="mt-1 space-y-1">
              {locked.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-[var(--muted)] hover:bg-[var(--surface-2)]"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Upgrade
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

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
        {unlocked.length}/{MODULE_NAV.length} modules · {MODULE_CATALOG.length} in catalog
      </div>
    </aside>
  );
}
