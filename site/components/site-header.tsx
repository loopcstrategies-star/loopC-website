"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function linkClass(active: boolean) {
  return active
    ? "text-teal-300 font-semibold"
    : "text-slate-300 hover:text-white font-medium transition-colors";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "border-white/10 bg-slate-950/90 shadow-lg shadow-black/25 backdrop-blur-xl"
          : "border-white/10 bg-[#050b16]/95 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo variant="footer" />
        <div className="flex items-center gap-4 lg:gap-6">
          <nav className="hidden items-center gap-5 text-sm lg:flex xl:gap-6" aria-label="Main">
            {nav.map(({ href, label }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  data-active={active ? "true" : undefined}
                  className={`nav-link ${linkClass(active)}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/free-demo"
            className="primary-btn hidden items-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/15 px-5 py-2.5 text-sm font-semibold text-teal-100 shadow-[0_0_20px_rgba(20,184,166,0.15)] md:inline-flex"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Book a Demo
          </Link>
          <button
            type="button"
            className="inline-flex rounded-xl border border-white/15 bg-white/5 p-2.5 text-white shadow-sm lg:hidden"
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
          className="border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl lg:hidden"
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
              Book a Demo
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full border border-teal-400/40 px-4 py-3 text-center text-sm font-semibold text-teal-200"
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
