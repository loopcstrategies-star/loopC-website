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

const BAR_HEIGHTS = [40, 58, 45, 72, 55, 88, 64, 92];

const ACTIVITY_ROWS = [
  { label: "Invoice #1042 paid", status: "success" as const, time: "2m ago" },
  { label: "Low stock · SKU-441", status: "warning" as const, time: "8m ago" },
  { label: "New lead · Acme Corp", status: "info" as const, time: "14m ago" },
];

const MODULE_CHIPS = ["CRM", "Inventory", "Finance"];

function StatusDot({ tone }: { tone: "success" | "warning" | "info" }) {
  const colors = {
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    info: "bg-blue-400",
  };
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors[tone]}`} />;
}

function RevenueSparkline({ reduce }: { reduce: boolean | null }) {
  return (
    <svg viewBox="0 0 120 32" className="h-8 w-full" aria-hidden>
      <defs>
        <linearGradient id="hero-spark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#hero-spark-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,24 16,18 28,22 42,12 56,16 72,8 88,14 104,6 120,10"
        className={reduce ? "" : "hero-chart-line"}
      />
    </svg>
  );
}

export function HeroProductVisual() {
  const reduce = useReducedMotion();
  const revenue = useCountUp(124, !reduce, 1400);
  const sales = useCountUp(48, !reduce, 1400);
  const growth = useCountUp(18, !reduce, 1400);
  const orders = useCountUp(326, !reduce, 1400);
  const customers = useCountUp(842, !reduce, 1400);

  return (
    <div className="relative mx-auto w-full max-w-full overflow-x-hidden lg:max-w-none">
      {/* Back glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-600/30 via-violet-600/20 to-cyan-500/15 blur-3xl ${reduce ? "" : "hero-glow-pulse"}`}
        aria-hidden
      />

      {/* Main dashboard */}
      <motion.div
        className={`hero-dashboard-frame relative z-10 ${reduce ? "" : "hero-dashboard-float"}`}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass-dark relative overflow-hidden rounded-2xl p-4 shadow-2xl shadow-blue-950/40">
          {/* Header bar */}
          <div className="relative z-10 mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-[10px] text-slate-500">LoopC · Business Dashboard</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${reduce ? "" : "hero-live-dot"}`} />
              Live sync
            </span>
          </div>

          {/* KPI row */}
          <div className="relative z-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Revenue", value: `₹${revenue}L`, tone: "text-blue-300" },
              { label: "Sales", value: String(sales), tone: "text-violet-300" },
              { label: "Growth", value: `+${growth}%`, tone: "text-cyan-300" },
              { label: "Orders", value: String(orders), tone: "text-blue-300" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
                <p className="text-[10px] text-slate-400">{kpi.label}</p>
                <p className={`mt-0.5 text-sm font-bold tabular-nums ${kpi.tone}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Module strip */}
          <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
            {MODULE_CHIPS.map((mod) => (
              <span
                key={mod}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300"
              >
                {mod}
              </span>
            ))}
          </div>

          {/* Charts + activity */}
          <div className="relative z-10 mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                  Performance
                </p>
                <p className="text-[10px] text-slate-500">This week</p>
              </div>
              <div className="mt-3 flex h-20 items-end gap-1.5 overflow-hidden">
                {BAR_HEIGHTS.map((h, i) => (
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
                Revenue trend
              </p>
              <RevenueSparkline reduce={reduce} />
              <p className="mt-1 text-xs font-bold text-white tabular-nums">{customers} customers</p>
              <p className="text-[10px] text-slate-400">Active this month</p>
            </div>
          </div>

          {/* Activity list — always visible; mobile gets simplified inline view */}
          <ul className="relative z-10 mt-3 space-y-1.5">
            {ACTIVITY_ROWS.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <StatusDot tone={row.status} />
                  <span className="truncate text-[11px] text-slate-300">{row.label}</span>
                </span>
                <span className="shrink-0 text-[10px] text-slate-500">{row.time}</span>
              </li>
            ))}
          </ul>

          <p className="relative z-10 mt-3 text-[10px] text-slate-500">
            Illustrative product UI · marketing mock
          </p>
        </div>
      </motion.div>

      {/* Float card A — revenue (desktop only) */}
      <div className="hero-float absolute -left-2 top-6 z-20 hidden w-40 rounded-xl border border-white/10 bg-[#0f172a]/95 p-3 shadow-xl backdrop-blur-xl lg:block">
        <p className="text-[10px] font-semibold text-cyan-300">Revenue</p>
        <p className="mt-1 text-lg font-bold text-white">+18.4%</p>
        <p className="text-[10px] text-slate-400">vs last month</p>
      </div>

      {/* Float card B — CRM notification (desktop only) */}
      <div className="hero-float-alt absolute -right-2 top-20 z-20 hidden w-44 rounded-xl border border-white/10 bg-[#0f172a]/95 p-3 shadow-xl backdrop-blur-xl lg:block">
        <p className="text-[10px] font-semibold text-violet-300">CRM · New lead</p>
        <p className="mt-1 text-xs text-slate-200">Acme Corp enquiry</p>
        <p className="text-[10px] text-slate-500">Just now</p>
      </div>

      {/* Float card C — team activity (desktop only) */}
      <div className="hero-float-slow absolute bottom-4 left-6 z-20 hidden rounded-xl border border-white/10 bg-[#0f172a]/95 px-3 py-2 shadow-xl backdrop-blur-xl lg:flex lg:items-center lg:gap-2">
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
