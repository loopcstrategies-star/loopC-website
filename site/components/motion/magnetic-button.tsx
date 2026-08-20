"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "light" | "dark";
  showArrow?: boolean;
};

const variants = {
  primary:
    "btn-primary interactive-shine inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25",
  secondary:
    "btn-secondary inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-blue-200 hover:bg-blue-50",
  light:
    "btn-primary interactive-shine inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20",
  dark:
    "btn-secondary inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-6 py-3 text-sm font-semibold text-[var(--navy)] hover:border-white/40 hover:bg-blue-50",
};

export function MagneticButton({
  href,
  children,
  className = "",
  variant = "primary",
  showArrow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const external = /^https?:\/\//i.test(href);

  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    const node = ref.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    node.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  }

  function onLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "translate(0, 0)";
  }

  const classNames = `${variants[variant]} ${className}`;
  const style = { transition: "transform 160ms ease-out" };

  const content = (
    <>
      {children}
      {showArrow ? (
        <span className="btn-arrow" aria-hidden>
          →
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        className={classNames}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={classNames}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
    >
      {content}
    </Link>
  );
}
