"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

function useCountUp(target: number, enabled: boolean, duration = 1200) {
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, duration]);

  return value;
}

export function HeroProductVisual() {
  const reduce = useReducedMotion();
  const revenue = useCountUp(124, !reduce, 1400);
  const customers = useCountUp(842, !reduce, 1400);

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <motion.div
        className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/95 p-4 shadow-2xl shadow-blue-950/40"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[10px] text-slate-500">LoopC · Business Dashboard</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Revenue", value: `₹${revenue}L`, tone: "text-blue-300" },
            { label: "Sales", value: "48", tone: "text-violet-300" },
            { label: "Expenses", value: "₹28L", tone: "text-cyan-300" },
            { label: "Customers", value: String(customers), tone: "text-blue-300" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
              <p className="text-[10px] text-slate-400">{kpi.label}</p>
              <p className={`mt-0.5 text-sm font-bold ${kpi.tone}`}>{kpi.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
              Performance
            </p>
            <div className="mt-3 flex h-20 items-end gap-1.5">
              {[40, 58, 45, 72, 55, 88, 64, 92].map((h, i) => (
                <span
                  key={i}
                  className="w-full origin-bottom rounded-sm bg-gradient-to-t from-blue-600 to-violet-400"
                  style={{
                    height: `${h}%`,
                    animation: reduce ? undefined : `bar-grow 0.6s ease ${i * 0.05}s both`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">
              Inventory · Analytics
            </p>
            <ul className="mt-3 space-y-2">
              {["SKU alerts · 6 low", "Orders shipped · 128", "Open tasks · 14"].map((row) => (
                <li
                  key={row}
                  className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-[11px] text-slate-300"
                >
                  {row}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-slate-500">Illustrative product UI · marketing mock</p>
      </motion.div>

      <div
        className={`hero-float absolute -left-2 top-8 z-20 hidden w-40 rounded-xl border border-white/10 bg-[#0f172a]/95 p-3 shadow-xl sm:block ${
          reduce ? "" : ""
        }`}
      >
        <p className="text-[10px] font-semibold text-cyan-300">Revenue</p>
        <p className="mt-1 text-lg font-bold text-white">+18.4%</p>
        <p className="text-[10px] text-slate-400">vs last month</p>
      </div>

      <div className="hero-float-alt absolute -right-1 bottom-16 z-20 hidden w-44 rounded-xl border border-white/10 bg-[#0f172a]/95 p-3 shadow-xl sm:block">
        <p className="text-[10px] font-semibold text-violet-300">Notification</p>
        <p className="mt-1 text-xs text-slate-200">Invoice #1042 paid</p>
        <p className="text-[10px] text-slate-500">2 min ago</p>
      </div>

      <div className="hero-float absolute bottom-2 left-8 z-20 hidden rounded-xl border border-white/10 bg-[#0f172a]/95 px-3 py-2 shadow-xl md:flex md:items-center md:gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white">
          A
        </span>
        <div>
          <p className="text-[10px] font-semibold text-white">Team activity</p>
          <p className="text-[10px] text-slate-400">3 online now</p>
        </div>
      </div>
    </div>
  );
}
