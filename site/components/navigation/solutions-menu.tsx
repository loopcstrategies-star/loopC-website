"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { solutionsNav } from "@/lib/navigation";

function isSolutionsActive(pathname: string) {
  return (
    pathname.startsWith("/solutions") ||
    pathname.startsWith("/erp") ||
    pathname.startsWith("/features")
  );
}

export function SolutionsMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const active = isSolutionsActive(pathname);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`nav-link inline-flex items-center gap-1 whitespace-nowrap ${
          active
            ? "font-semibold text-blue-300"
            : "font-medium text-slate-300 transition-colors hover:text-white"
        }`}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        Solutions
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-xl border border-white/10 bg-slate-950/95 p-2 shadow-xl backdrop-blur-xl"
        >
          {solutionsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block rounded-lg px-3 py-2.5 transition hover:bg-white/5"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              <span className="block text-sm font-medium text-white">{item.label}</span>
              {item.description ? (
                <span className="mt-0.5 block text-xs text-slate-400">{item.description}</span>
              ) : null}
            </Link>
          ))}
          <Link
            href="/solutions"
            role="menuitem"
            className="mt-1 block rounded-lg border-t border-white/10 px-3 py-2.5 text-xs font-semibold text-blue-300 transition hover:bg-white/5"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            View all solutions →
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function MobileSolutionsGroup({ onNavigate }: { onNavigate?: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-lg font-medium text-slate-200"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        Solutions
        <svg
          className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded ? (
        <div className="space-y-1 border-t border-white/10 px-2 py-2">
          {solutionsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/solutions"
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-blue-300 hover:bg-white/5"
            onClick={onNavigate}
          >
            View all solutions
          </Link>
        </div>
      ) : null}
    </div>
  );
}
