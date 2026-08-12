"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "light";
};

const variants = {
  primary:
    "btn-primary interactive-shine inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-700/20",
  secondary:
    "btn-secondary inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white",
  light:
    "btn-primary interactive-shine inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-700/15",
};

export function MagneticButton({
  href,
  children,
  className = "",
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

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

  return (
    <Link
      ref={ref}
      href={href}
      className={`${variants[variant]} ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 160ms ease-out" }}
    >
      {children}
    </Link>
  );
}
