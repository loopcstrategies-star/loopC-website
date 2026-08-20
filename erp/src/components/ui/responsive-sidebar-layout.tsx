"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export function ResponsiveSidebarLayout({
  sidebar,
  title,
  headerActions,
  children,
  variant = "default",
}: {
  sidebar: ReactNode;
  title?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
  variant?: "default" | "admin";
}) {
  usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = variant === "admin";

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
    <div className="flex min-h-full bg-[var(--bg)]">
      <div className="hidden shrink-0 lg:flex">{sidebar}</div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(100%,18rem)] max-w-[85vw] shadow-2xl transition-transform lg:hidden">
            <div
              className={`flex h-full w-full min-h-0 flex-col overflow-y-auto overscroll-contain ${
                isAdmin ? "bg-[var(--navy,#0b1020)]" : "bg-[var(--surface)]"
              }`}
            >
              {sidebar}
            </div>
          </div>
        </>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 backdrop-blur md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="inline-flex shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--ink)] hover:bg-[var(--surface-2)] lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            {title ? (
              <div className="min-w-0 truncate font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--ink)]">
                {title}
              </div>
            ) : null}
          </div>
          {headerActions ? (
            <div className="flex shrink-0 items-center gap-2">{headerActions}</div>
          ) : null}
        </header>
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
