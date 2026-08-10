"use client";

import { useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

type NodeTone = "teal" | "purple" | "blue" | "orange" | "pink" | "violet";

const tone = {
  teal: {
    solid: "#2dd4bf",
    soft: "rgba(45,212,191,0.35)",
    glow: "rgba(45,212,191,0.55)",
    gradient: "from-teal-400 to-cyan-500",
  },
  purple: {
    solid: "#a78bfa",
    soft: "rgba(167,139,250,0.4)",
    glow: "rgba(167,139,250,0.6)",
    gradient: "from-violet-400 to-purple-600",
  },
  blue: {
    solid: "#60a5fa",
    soft: "rgba(96,165,250,0.4)",
    glow: "rgba(96,165,250,0.55)",
    gradient: "from-sky-400 to-blue-600",
  },
  orange: {
    solid: "#fb923c",
    soft: "rgba(251,146,60,0.4)",
    glow: "rgba(251,146,60,0.55)",
    gradient: "from-orange-400 to-amber-500",
  },
  pink: {
    solid: "#f472b6",
    soft: "rgba(244,114,182,0.4)",
    glow: "rgba(244,114,182,0.55)",
    gradient: "from-pink-400 to-rose-500",
  },
  violet: {
    solid: "#c084fc",
    soft: "rgba(192,132,252,0.4)",
    glow: "rgba(192,132,252,0.55)",
    gradient: "from-fuchsia-400 to-violet-600",
  },
} as const;

/* ─── Possibilities: LoopC ecosystem diagram ─── */

const ecoNodes: {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  tone: NodeTone;
}[] = [
  { id: "ops", label: "OPS", icon: "⚙", x: 200, y: 42, tone: "purple" },
  { id: "apps", label: "APPS", icon: "📱", x: 48, y: 160, tone: "blue" },
  { id: "cx", label: "CX", icon: "👤", x: 352, y: 160, tone: "pink" },
  { id: "auto", label: "AUTO", icon: "⚡", x: 90, y: 300, tone: "orange" },
  { id: "data", label: "DATA", icon: "📊", x: 310, y: 300, tone: "teal" },
  { id: "ai", label: "AI", icon: "✦", x: 200, y: 380, tone: "violet" },
];

const ecoPaths: { id: string; d: string; from: string; to: string }[] = [
  { id: "p-ops", d: "M200 95 L200 155", from: "ops", to: "hub" },
  { id: "p-apps", d: "M95 175 L155 195", from: "apps", to: "hub" },
  { id: "p-cx", d: "M305 175 L245 195", from: "cx", to: "hub" },
  { id: "p-auto", d: "M120 285 L170 245", from: "auto", to: "hub" },
  { id: "p-data", d: "M280 285 L230 245", from: "data", to: "hub" },
  { id: "p-ai", d: "M200 340 L200 255", from: "ai", to: "hub" },
];

export function LoopcEcosystemDiagram({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState<string | null>(null);

  const lineActive = (from: string) => active === null || active === from || active === "hub";

  return (
    <div
      className={`eco-stage relative aspect-[400/420] w-full overflow-hidden rounded-3xl ${className}`}
      onMouseLeave={() => setActive(null)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(20,184,166,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_70%_20%,rgba(167,139,250,0.12),transparent)]" />

      {/* Particles */}
      {!reduce
        ? Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="eco-particle pointer-events-none absolute h-1 w-1 rounded-full bg-teal-300/60"
              style={{
                left: `${12 + (i * 7) % 76}%`,
                top: `${18 + (i * 11) % 64}%`,
                animationDelay: `${i * 0.35}s`,
              }}
            />
          ))
        : null}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 420"
        fill="none"
        aria-hidden
      >
        <defs>
          <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {ecoPaths.map((p) => {
          const node = ecoNodes.find((n) => n.id === p.from);
          const color = node ? tone[node.tone].solid : "#2dd4bf";
          const on = lineActive(p.from);
          return (
            <g key={p.id}>
              <path
                d={p.d}
                stroke={color}
                strokeWidth={on && active ? 2.5 : 1.5}
                strokeOpacity={on ? (active ? 0.95 : 0.35) : 0.12}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {!reduce && on ? (
                <circle r={active ? 3.5 : 2.5} fill={color} opacity={active ? 1 : 0.7}>
                  <animateMotion dur={`${3.8 + (p.id.length % 3) * 0.4}s`} repeatCount="indefinite" path={p.d} />
                </circle>
              ) : null}
            </g>
          );
        })}

        {/* Center hub ring */}
        <circle
          cx="200"
          cy="210"
          r="52"
          stroke="rgba(45,212,191,0.25)"
          strokeWidth="1"
          fill="none"
          className={reduce ? "" : "eco-pulse-ring"}
        />
      </svg>

      {/* Center LOOPC */}
      <button
        type="button"
        className="eco-hub absolute left-1/2 top-1/2 z-20 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-teal-400/50 bg-slate-950/80 shadow-[0_0_40px_rgba(45,212,191,0.35)] backdrop-blur-md transition duration-300 hover:scale-[1.08] hover:shadow-[0_0_56px_rgba(45,212,191,0.55)]"
        onMouseEnter={() => setActive("hub")}
        aria-label="LoopC hub"
      >
        <span className="text-[10px] font-bold tracking-[0.2em] text-teal-300">LOOPC</span>
        <span className="mt-0.5 text-[9px] font-medium text-slate-400">HUB</span>
      </button>

      {/* Capability nodes */}
      {ecoNodes.map((n) => {
        const t = tone[n.tone];
        const isActive = active === n.id || active === "hub";
        return (
          <button
            key={n.id}
            type="button"
            className={`eco-node absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border px-3 py-2 backdrop-blur-md transition duration-300 ${
              reduce ? "" : "eco-node-float"
            }`}
            style={{
              left: `${(n.x / 400) * 100}%`,
              top: `${(n.y / 420) * 100}%`,
              borderColor: isActive ? t.solid : "rgba(255,255,255,0.1)",
              background: isActive
                ? `linear-gradient(135deg, ${t.soft}, rgba(15,23,42,0.85))`
                : "rgba(15,23,42,0.72)",
              boxShadow: isActive ? `0 0 28px ${t.glow}` : "0 8px 24px rgba(0,0,0,0.35)",
              transform: `translate(-50%, -50%) scale(${isActive && active === n.id ? 1.08 : 1})`,
              animationDelay: `${ecoNodes.indexOf(n) * 0.2}s`,
            }}
            onMouseEnter={() => setActive(n.id)}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-sm text-white shadow-lg ${t.gradient}`}
            >
              {n.icon}
            </span>
            <span className="text-[11px] font-bold tracking-wide text-white">{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Why LoopC: laptop + mobile + capability orbit ─── */

const hubNodes: {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  tone: NodeTone;
}[] = [
  { id: "web", label: "WEB APPS", icon: "◈", x: 50, y: 8, tone: "purple" },
  { id: "mobile", label: "MOBILE", icon: "📱", x: 6, y: 42, tone: "blue" },
  { id: "erp", label: "ERP", icon: "▣", x: 94, y: 42, tone: "teal" },
  { id: "mgmt", label: "MANAGEMENT", icon: "◎", x: 50, y: 72, tone: "blue" },
  { id: "data", label: "BUSINESS DATA", icon: "◈", x: 50, y: 92, tone: "orange" },
  { id: "custom", label: "CUSTOM", icon: "✦", x: 88, y: 78, tone: "pink" },
];

export function CapabilityHubVisual({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className={`eco-stage relative aspect-[5/4] w-full overflow-hidden rounded-3xl ${className}`}
      onMouseLeave={() => setActive(null)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(20,184,166,0.2),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_30%_at_20%_25%,rgba(167,139,250,0.14),transparent)]" />

      {!reduce
        ? Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="eco-particle pointer-events-none absolute h-1 w-1 rounded-full bg-violet-300/50"
              style={{
                left: `${8 + (i * 9) % 84}%`,
                top: `${10 + (i * 13) % 70}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))
        : null}

      {/* Connection lines */}
      <svg className="pointer-events-none absolute inset-0 z-[5] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {[
          { d: "M50 28 L50 18", id: "web", c: tone.purple.solid },
          { d: "M42 40 L18 42", id: "mobile", c: tone.blue.solid },
          { d: "M58 40 L82 42", id: "erp", c: tone.teal.solid },
          { d: "M50 55 L50 68", id: "mgmt", c: tone.blue.solid },
          { d: "M50 68 L50 86", id: "data", c: tone.orange.solid },
          { d: "M58 58 L82 74", id: "custom", c: tone.pink.solid },
        ].map((p) => {
          const on = active === null || active === p.id;
          return (
            <path
              key={p.id}
              d={p.d}
              stroke={p.c}
              strokeWidth={active === p.id ? 0.55 : 0.28}
              strokeOpacity={on ? (active === p.id ? 0.95 : 0.35) : 0.1}
              strokeLinecap="round"
              className="transition-all duration-300"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Laptop */}
      <div
        className={`absolute left-[18%] top-[22%] z-10 w-[64%] ${reduce ? "" : "hero-float"}`}
      >
        <div className="rounded-t-xl border border-white/15 bg-slate-900/90 p-2 shadow-2xl shadow-teal-950/40 backdrop-blur-md sm:p-2.5">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            </div>
            <span className="text-[8px] font-semibold tracking-wide text-teal-300/80">LoopC ERP</span>
          </div>
          <div className="overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="flex min-h-[120px] sm:min-h-[150px]">
              <aside className="w-10 bg-slate-900 p-1.5 sm:w-12">
                <div className="mb-2 h-1.5 w-full rounded bg-gradient-to-r from-teal-400 to-violet-400" />
                <div className="space-y-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-1 w-full rounded bg-white/15" />
                  ))}
                </div>
              </aside>
              <div className="flex-1 p-2">
                <div className="mb-2 flex gap-1.5">
                  <div className="h-7 flex-1 rounded-md bg-gradient-to-br from-teal-400/25 to-teal-500/10" />
                  <div className="h-7 flex-1 rounded-md bg-gradient-to-br from-violet-400/20 to-violet-500/10" />
                  <div className="h-7 flex-1 rounded-md bg-gradient-to-br from-orange-400/20 to-amber-500/10" />
                </div>
                <div className="flex h-12 items-end gap-1 sm:h-16">
                  {[40, 70, 45, 85, 55, 75, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-teal-500 to-cyan-300 origin-bottom"
                      style={{
                        height: `${h}%`,
                        animation: reduce ? undefined : `bar-grow 0.8s ease ${0.1 * i}s both`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto h-2 w-[108%] -translate-x-[4%] rounded-b-lg bg-slate-800" />
        <div className="mx-auto h-1.5 w-[40%] rounded-b-md bg-slate-700" />
      </div>

      {/* Phone */}
      <div
        className={`absolute bottom-[18%] right-[10%] z-20 w-[22%] ${reduce ? "" : "hero-float-alt"}`}
      >
        <div className="rounded-[1.1rem] border border-white/20 bg-slate-950 p-1 shadow-xl shadow-violet-950/40">
          <div className="overflow-hidden rounded-[0.85rem] bg-slate-900">
            <div className="mx-auto mt-1.5 h-1 w-6 rounded-full bg-white/15" />
            <div className="space-y-1.5 p-2 pt-3">
              <div className="h-1.5 w-10 rounded bg-teal-400/70" />
              <div className="h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-teal-500/20" />
              <div className="h-1.5 w-full rounded bg-white/10" />
              <div className="h-1.5 w-3/4 rounded bg-white/10" />
              <div className="mt-1 grid grid-cols-2 gap-1">
                <div className="h-5 rounded bg-pink-400/25" />
                <div className="h-5 rounded bg-orange-400/25" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orbit nodes */}
      {hubNodes.map((n, i) => {
        const t = tone[n.tone];
        const isActive = active === n.id;
        return (
          <button
            key={n.id}
            type="button"
            className={`absolute z-30 rounded-2xl border px-2.5 py-1.5 backdrop-blur-md transition duration-300 ${
              reduce ? "" : "eco-node-float"
            }`}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: `translate(-50%, -50%) scale(${isActive ? 1.08 : 1})`,
              borderColor: isActive ? t.solid : "rgba(255,255,255,0.12)",
              background: isActive
                ? `linear-gradient(135deg, ${t.soft}, rgba(15,23,42,0.9))`
                : "rgba(15,23,42,0.75)",
              boxShadow: isActive
                ? `0 0 32px ${t.glow}`
                : `0 0 16px ${t.soft}`,
              animationDelay: `${i * 0.25}s`,
            }}
            onMouseEnter={() => setActive(n.id)}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] text-white ${t.gradient} ${
                  reduce ? "" : "eco-node-pulse"
                }`}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {n.icon}
              </span>
              <span className="hidden text-[9px] font-bold tracking-wide text-white sm:inline">
                {n.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
