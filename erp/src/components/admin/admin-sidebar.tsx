import Link from "next/link";

const MAIN = [{ href: "/admin", label: "Dashboard" }];

const WEBSITE = [
  { href: "/admin/website", label: "Home" },
  { href: "/admin/website/about", label: "About" },
  { href: "/admin/website/services", label: "Services" },
  { href: "/admin/website/erp-product", label: "ERP Product" },
  { href: "/admin/website/faqs", label: "FAQ" },
  { href: "/admin/website/contacts", label: "Contact" },
  { href: "/admin/website/seo", label: "SEO" },
  { href: "/admin/website/media", label: "Media" },
];

const SALES = [
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/companies", label: "Customers" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/coupons", label: "Coupons" },
];

const OPERATIONS = [
  { href: "/admin/website/contacts", label: "Enquiries" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/users", label: "Admin Users" },
  { href: "/admin/audit", label: "Audit Logs" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-[var(--ink)] hover:bg-[var(--surface-2)]"
    >
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
      {children}
    </p>
  );
}

export function AdminSidebar() {
  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4 lg:w-60">
      <Link href="/admin" className="brand-mark text-lg">
        LoopC Admin
      </Link>
      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto text-sm">
        {MAIN.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}

        <SectionLabel>Website</SectionLabel>
        {WEBSITE.map((l) => (
          <NavLink key={`${l.href}-${l.label}`} {...l} />
        ))}

        <SectionLabel>ERP Sales</SectionLabel>
        {SALES.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}

        <SectionLabel>Operations</SectionLabel>
        {OPERATIONS.map((l) => (
          <NavLink key={`${l.href}-${l.label}`} {...l} />
        ))}

        <Link
          href="/app"
          className="mt-4 block rounded-md px-3 py-2 text-[var(--muted)] hover:bg-[var(--surface-2)]"
        >
          ← Account portal
        </Link>
      </nav>
    </aside>
  );
}
