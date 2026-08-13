"use client";

import { useEffect, useState, type ReactNode } from "react";

export function ResponsiveSidebarLayout({
  sidebar,
  title,
  headerActions,
  children,
}: {
  sidebar: ReactNode;
  title?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

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
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-[min(100%,18rem)] shadow-xl lg:hidden">
            <div className="flex h-full w-full flex-col overflow-y-auto bg-[var(--surface)]">
              {sidebar}
            </div>
          </div>
        </>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="inline-flex shrink-0 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--ink)] hover:bg-[var(--surface-2)] lg:hidden"
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
              <div className="min-w-0 truncate text-sm text-[var(--muted)]">{title}</div>
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
