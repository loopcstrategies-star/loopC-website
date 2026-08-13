"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { getCtaNav, getLoginNav, primaryNav } from "@/lib/navigation";
import { getWhatsAppUrl, siteConfig, whatsappPrefill } from "@/lib/site-config";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavAnchor({
  href,
  external,
  className,
  children,
  onClick,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const whatsapp = getWhatsAppUrl(whatsappPrefill);
  const cta = getCtaNav();
  const login = getLoginNav();

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,height,box-shadow] duration-300 ${
        scrolled
          ? "border-white/10 bg-slate-950/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-white/10 bg-[#050b16]/95 backdrop-blur-xl"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 ${
          scrolled ? "h-14" : "h-[4.25rem]"
        }`}
      >
        <Logo variant="footer" />
        <div className="flex items-center gap-3 lg:gap-4">
          <nav
            className="hidden items-center gap-3 text-[0.75rem] xl:gap-4 2xl:gap-5 lg:flex"
            aria-label="Main"
          >
            {primaryNav.map(({ href, label }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  data-active={active ? "true" : undefined}
                  className={`nav-link ${
                    active
                      ? "font-semibold text-teal-300"
                      : "font-medium text-slate-300 transition-colors hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <NavAnchor
            href={login.href}
            external={login.external}
            className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white lg:inline-flex"
          >
            {login.label}
          </NavAnchor>
          <NavAnchor
            href={cta.href}
            external={cta.external}
            className="btn-primary interactive-shine hidden items-center rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 lg:inline-flex"
          >
            {cta.label}
          </NavAnchor>
          <button
            type="button"
            className="inline-flex rounded-xl border border-white/15 bg-white/5 p-2.5 text-white lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-haspopup="dialog"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-[#050b16] lg:hidden"
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Logo variant="footer" />
            <button
              ref={closeRef}
              type="button"
              className="inline-flex rounded-xl border border-white/15 bg-white/5 p-2.5 text-white"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6" aria-label="Mobile">
            {primaryNav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-3 text-lg ${
                  isActivePath(pathname, href)
                    ? "bg-white/5 font-semibold text-teal-300"
                    : "font-medium text-slate-200"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <NavAnchor
              href={login.href}
              external={login.external}
              className="mt-4 rounded-full border border-white/20 px-4 py-3.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              {login.label}
            </NavAnchor>
            <NavAnchor
              href={cta.href}
              external={cta.external}
              className="mt-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              {cta.label}
            </NavAnchor>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full border border-teal-400/40 px-4 py-3.5 text-center text-sm font-semibold text-teal-200"
                onClick={() => setOpen(false)}
              >
                WhatsApp
              </a>
            ) : null}
            <p className="mt-auto pt-8 text-sm text-slate-500">{siteConfig.location.short}</p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
