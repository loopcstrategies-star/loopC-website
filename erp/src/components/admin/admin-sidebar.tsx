"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN = [{ href: "/admin", label: "Dashboard", icon: "dashboard" }];

const WEBSITE = [
  { href: "/admin/website", label: "Home", icon: "home" },
  { href: "/admin/website/about", label: "About", icon: "about" },
  { href: "/admin/website/services", label: "Services", icon: "services" },
  { href: "/admin/website/solutions", label: "Solutions", icon: "about" },
  { href: "/admin/website/industries", label: "Industries", icon: "services" },
  { href: "/admin/website/erp-product", label: "ERP Product", icon: "erp" },
  { href: "/admin/website/faqs", label: "FAQ", icon: "faq" },
  { href: "/admin/website/blog", label: "Blog", icon: "blog" },
  { href: "/admin/website/testimonials", label: "Testimonials", icon: "testimonials" },
  { href: "/admin/website/contacts", label: "Contact", icon: "contact" },
  { href: "/admin/website/seo", label: "SEO", icon: "seo" },
  { href: "/admin/website/media", label: "Media", icon: "media" },
];

const SALES = [
  { href: "/admin/plans", label: "Plans", icon: "plans" },
  { href: "/admin/companies", label: "Customers", icon: "customers" },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: "subs" },
  { href: "/admin/payments", label: "Payments", icon: "payments" },
  { href: "/admin/invoices", label: "Invoices", icon: "invoices" },
  { href: "/admin/coupons", label: "Coupons", icon: "coupons" },
];

const OPERATIONS = [
  { href: "/admin/website/contacts", label: "Enquiries", icon: "enquiries" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/admin/users", label: "Admin Users", icon: "users" },
  { href: "/admin/audit", label: "Audit Logs", icon: "audit" },
];

function NavIcon({ name }: { name: string }) {
  const common = "h-4 w-4 shrink-0 opacity-80";
  switch (name) {
    case "dashboard":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      );
    default:
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
  }
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-[var(--admin-active,#2563eb33)] font-semibold text-white"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <NavIcon name={icon} />
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </p>
  );
}

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar flex h-full min-h-0 w-full shrink-0 flex-col border-r p-4 lg:w-60">
      <Link href="/admin" className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-white">
        LoopC Admin
      </Link>
      <nav className="mt-6 flex-1 space-y-0.5 overflow-y-auto text-sm">
        {MAIN.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}

        <SectionLabel>Website</SectionLabel>
        {WEBSITE.map((l) => (
          <NavLink key={`${l.href}-${l.label}`} {...l} />
        ))}

        <SectionLabel>Sales</SectionLabel>
        {SALES.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}

        <SectionLabel>Operations</SectionLabel>
        {OPERATIONS.map((l) => (
          <NavLink key={`${l.href}-${l.label}`} {...l} />
        ))}

        <Link
          href="/app"
          className="mt-4 block rounded-lg px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          ← Account portal
        </Link>
      </nav>
    </aside>
  );
}
