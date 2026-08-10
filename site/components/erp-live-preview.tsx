"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { erpFeatureGrid } from "@/lib/home-content";

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

export function ErpLivePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const active = inView && !reduce;

  const sales = useCountUp(487, active);
  const expenses = useCountUp(124, active);
  const profit = useCountUp(363, active);
  const orders = useCountUp(1248, active);

  const chartPoints = "0,70 40,55 80,60 120,35 160,45 200,20 240,28 280,12";

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">LoopC ERP</p>
        <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Run your business in one connected system
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-slate-300">
          {["Accounting", "Inventory", "Sales", "Purchasing", "HR", "Reports", "Customers", "Notifications"].map(
            (m) => (
              <li key={m} className="flex items-center gap-2">
                <span className="text-teal-400">✓</span>
                {m}
              </li>
            ),
          )}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/erp"
            className="primary-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-6 py-3 text-sm font-bold text-slate-950"
          >
            Explore ERP
            <span className="arrow inline-block transition-transform duration-300">→</span>
          </Link>
          <Link
            href="/features"
            className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-teal-400/50 hover:bg-white/5"
          >
            See all features
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-dark overflow-hidden rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white">LoopC ERP</p>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
              This month ▾
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Sales", value: `₹${(sales / 10).toFixed(1)}L` },
              { label: "Expenses", value: `₹${(expenses / 10).toFixed(1)}L` },
              { label: "Profit", value: `₹${(profit / 10).toFixed(1)}L` },
              { label: "Orders", value: orders.toLocaleString("en-IN") },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-white/5 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">{m.label}</p>
                <p className="mt-1 text-sm font-bold text-teal-200 sm:text-base">{m.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-slate-950/50 p-3">
            <svg viewBox="0 0 280 80" className="h-20 w-full" aria-hidden>
              <polyline
                fill="none"
                stroke="rgba(45,212,191,0.25)"
                strokeWidth="2"
                points={chartPoints}
              />
              <motion.polyline
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartPoints}
                initial={reduce ? false : { pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            </svg>
          </div>
          {!reduce && inView ? (
            <motion.div
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold text-amber-200"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              New order synced · Inventory updated
            </motion.div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {erpFeatureGrid.map((f) => (
            <div key={f.title} className="erp-module-card group">
              <span className="erp-module-icon" aria-hidden>
                ◉
              </span>
              <p className="mt-2 text-xs font-semibold text-white">{f.title}</p>
              <span className="erp-module-arrow" aria-hidden>
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
