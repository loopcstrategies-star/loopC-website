import Link from "next/link";

const PRIMARY = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/settings", label: "Settings" },
];

const WEBSITE = [
  { href: "/admin/website", label: "Home / Settings" },
  { href: "/admin/website/services", label: "Services" },
  { href: "/admin/website/blog", label: "Blog" },
  { href: "/admin/website/faqs", label: "FAQs" },
  { href: "/admin/website/testimonials", label: "Testimonials" },
  { href: "/admin/website/contacts", label: "Contacts" },
  { href: "/admin/website/seo", label: "SEO" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 hover:bg-[var(--surface-2)]"
    >
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4 lg:w-56">
      <Link href="/admin" className="brand-mark text-lg">
        LoopC Admin
      </Link>
      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto text-sm">
        {PRIMARY.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}
        <p className="mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Website CMS
        </p>
        {WEBSITE.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}
        <Link
          href="/app"
          className="mt-4 block rounded-md px-3 py-2 text-[var(--muted)] hover:bg-[var(--surface-2)]"
        >
          ← Back to app
        </Link>
      </nav>
    </aside>
  );
}
