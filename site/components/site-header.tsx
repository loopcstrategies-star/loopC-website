"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { getWhatsAppUrl } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/erp", label: "ERP" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

function linkClass(active: boolean) {
  return active
    ? "text-teal-700 font-semibold"
    : "text-slate-600 hover:text-slate-900 font-medium transition-colors";
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-4 lg:gap-6">
          <nav
            className="hidden items-center gap-5 text-sm lg:flex xl:gap-6"
            aria-label="Main"
          >
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={linkClass(isActivePath(pathname, href))}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/free-demo"
            className="hidden rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:brightness-105 md:inline-flex"
          >
            Book demo
          </Link>
          <button
            type="button"
            className="inline-flex rounded-xl border border-slate-200/90 bg-white/80 p-2.5 text-slate-800 shadow-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2.5 ${linkClass(isActivePath(pathname, href))}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/free-demo"
              className="mt-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Book demo
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full border border-teal-200 px-4 py-3 text-center text-sm font-semibold text-teal-800"
              onClick={() => setOpen(false)}
            >
              WhatsApp us
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
