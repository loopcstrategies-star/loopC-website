"use client";

import { FadeIn } from "@/components/fade-in";
import { detailedProcess } from "@/lib/home-content";
import { useReducedMotion } from "framer-motion";

const stepMeta = [
  {
    accent: "#2dd4bf",
    glow: "rgba(45,212,191,0.45)",
    gradient: "from-teal-400 to-cyan-500",
    icon: (
      <path
        d="M9 4a5 5 0 013.9 8.1l3 3a1 1 0 01-1.4 1.4l-3-3A5 5 0 119 4zm0 2a3 3 0 100 6 3 3 0 000-6z"
        fill="currentColor"
      />
    ),
  },
  {
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.45)",
    gradient: "from-sky-400 to-blue-600",
    icon: (
      <path
        d="M5 3h8a2 2 0 012 2v12a1 1 0 01-1.6.8L10 15.5l-3.4 2.3A1 1 0 015 17V5a2 2 0 012-2zm2 0v10.2l2.4-1.6a1 1 0 011.2 0L13 13.2V5H7z"
        fill="currentColor"
      />
    ),
  },
  {
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.45)",
    gradient: "from-violet-400 to-purple-600",
    icon: (
      <path
        d="M14.5 2.5l1 1-8.2 8.2-.3 1.8 1.8-.3L15.5 6l1 1-7.8 7.8a1 1 0 01-.5.3l-3 .5a.8.8 0 01-.9-.9l.5-3a1 1 0 01.3-.5L14.5 2.5z"
        fill="currentColor"
      />
    ),
  },
  {
    accent: "#fb923c",
    glow: "rgba(251,146,60,0.45)",
    gradient: "from-orange-400 to-amber-500",
    icon: (
      <path
        d="M7.2 5.2L4.8 7.6a1 1 0 000 1.4L7.2 11.4a1 1 0 001.4-1.4L6.9 8.3l1.7-1.7a1 1 0 10-1.4-1.4zm5.6 0a1 1 0 00-1.4 1.4l1.7 1.7-1.7 1.7a1 1 0 101.4 1.4l2.4-2.4a1 1 0 000-1.4l-2.4-2.4z"
        fill="currentColor"
      />
    ),
  },
  {
    accent: "#4ade80",
    glow: "rgba(74,222,128,0.45)",
    gradient: "from-emerald-400 to-green-600",
    icon: (
      <path
        d="M10 2a7 7 0 015.8 10.9l.9.9a1 1 0 01-1.4 1.4l-.9-.9A7 7 0 1110 2zm0 2a5 5 0 100 10 5 5 0 000-10zm2.3 3.3l-2.8 2.8-1.2-1.2a1 1 0 10-1.4 1.4l1.9 1.9a1 1 0 001.4 0l3.5-3.5a1 1 0 10-1.4-1.4z"
        fill="currentColor"
      />
    ),
  },
  {
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.45)",
    gradient: "from-pink-400 to-rose-500",
    icon: (
      <path
        d="M10 3a5.5 5.5 0 014.9 8H16a3 3 0 010 6h-1v-2h1a1 1 0 000-2h-2.2l-.3-1.1A3.5 3.5 0 0010 5a3.5 3.5 0 00-3.4 2.7L6.3 9H5a2 2 0 100 4h1v2H5a4 4 0 010-8h.2A5.5 5.5 0 0110 3zm0 7v5l-2-2 1.4-1.4L10 13.2l1.6-1.6L13 13l-2 2v-5h-1z"
        fill="currentColor"
      />
    ),
  },
  {
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.45)",
    gradient: "from-sky-400 to-indigo-500",
    icon: (
      <path
        d="M7 11a3 3 0 116 0v1h1a2 2 0 012 2v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1a2 2 0 012-2h1v-1zm2 0v1h2v-1a1 1 0 10-2 0zm-2 4v1a1 1 0 001 1h4a1 1 0 001-1v-1H7z"
        fill="currentColor"
      />
    ),
  },
] as const;

function ProcessDevices({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="relative mx-auto mt-10 aspect-[5/4] w-full max-w-md">
      {/* Orbit rings */}
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] h-[70%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-400/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] h-[48%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-teal-400/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] h-[40%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/15 blur-3xl"
        aria-hidden
      />

      {/* Floating 3D tiles */}
      {[
        { label: "</>", grad: "from-violet-500 to-purple-700", pos: "left-[4%] top-[18%]", delay: "0s" },
        { label: "↑☁", grad: "from-sky-400 to-blue-600", pos: "right-[2%] top-[22%]", delay: "0.4s" },
        { label: "🚀", grad: "from-orange-400 to-amber-500", pos: "right-[8%] bottom-[18%]", delay: "0.8s" },
        { label: "🛡", grad: "from-teal-400 to-emerald-600", pos: "left-[6%] bottom-[22%]", delay: "1.2s" },
      ].map((tile) => (
        <div
          key={tile.label}
          className={`absolute z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tile.grad} text-sm font-bold text-white shadow-lg ${tile.pos} ${
            reduce ? "" : "eco-node-float"
          }`}
          style={{
            animationDelay: tile.delay,
            boxShadow: "0 10px 30px rgba(0,0,0,0.35), 0 0 24px rgba(255,255,255,0.12)",
          }}
          aria-hidden
        >
          {tile.label === "</>" ? (
            <span className="font-mono text-xs">&lt;/&gt;</span>
          ) : tile.label === "↑☁" ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3l3 3h-2v5H9V6H7l3-3zm-5 9h10v2H5v-2zm0 3h10v1H5v-1z" />
            </svg>
          ) : tile.label === "🚀" ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2c3 3 4 6 4 9l-2 1-1 3-1-3-2-1c0-3 1-6 4-9zm0 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2l6 2v5c0 4-2.5 6.5-6 8-3.5-1.5-6-4-6-8V4l6-2zm0 3.2l-4 1.3v3.7c0 2.5 1.5 4.3 4 5.5 2.5-1.2 4-3 4-5.5V6.5l-4-1.3z" />
            </svg>
          )}
        </div>
      ))}

      {/* Laptop */}
      <div className={`absolute left-[8%] top-[16%] z-10 w-[72%] ${reduce ? "" : "hero-float"}`}>
        <div className="rounded-t-xl border border-white/15 bg-slate-900/95 p-2 shadow-2xl shadow-teal-950/50 backdrop-blur-md sm:p-2.5">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            </div>
            <span className="text-[8px] font-semibold tracking-wide text-teal-300/80">LoopC Build</span>
          </div>
          <div className="overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 to-slate-900">
            <div className="grid grid-cols-3 gap-1.5 p-2 sm:p-2.5">
              <div className="col-span-1 flex aspect-square items-center justify-center rounded-lg bg-slate-800/80">
                <div className="h-10 w-10 rounded-full border-[3px] border-teal-400 border-t-violet-400 border-r-orange-400" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <div className="h-8 rounded-md bg-gradient-to-r from-violet-500/30 to-teal-500/20" />
                <div className="flex h-10 items-end gap-0.5">
                  {[45, 70, 40, 85, 55, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-teal-500 to-cyan-300"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-span-3 mt-0.5 h-6 rounded-md bg-gradient-to-r from-pink-500/20 via-blue-500/20 to-orange-500/20" />
            </div>
          </div>
        </div>
        <div className="mx-auto h-2 w-[108%] -translate-x-[4%] rounded-b-lg bg-slate-800" />
        <div className="mx-auto h-1.5 w-[38%] rounded-b-md bg-slate-700" />
      </div>

      {/* Phone */}
      <div
        className={`absolute bottom-[10%] right-[6%] z-20 w-[28%] ${reduce ? "" : "hero-float-alt"}`}
      >
        <div className="rounded-[1.15rem] border border-white/20 bg-slate-950 p-1 shadow-xl shadow-violet-950/40">
          <div className="overflow-hidden rounded-[0.9rem] bg-slate-900">
            <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-white/15" />
            <div className="space-y-1.5 p-2 pt-3">
              <div className="mx-auto h-10 w-10 rounded-full border-[3px] border-violet-400 border-b-teal-400" />
              <div className="h-1.5 w-full rounded bg-white/10" />
              <div className="grid grid-cols-2 gap-1">
                <div className="h-6 rounded bg-teal-400/25" />
                <div className="h-6 rounded bg-orange-400/25" />
                <div className="h-6 rounded bg-violet-400/25" />
                <div className="h-6 rounded bg-pink-400/25" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProcessTimeline() {
  const reduce = useReducedMotion();

  return (
    <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
      {/* Soft particles */}
      {!reduce
        ? Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="eco-particle pointer-events-none absolute h-1 w-1 rounded-full bg-teal-300/50"
              style={{
                left: `${6 + (i * 7) % 40}%`,
                top: `${10 + (i * 9) % 75}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))
        : null}

      <div className="relative z-[1]">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">How we build</p>
          <h2 className="font-display mt-3 max-w-lg text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            A clear process from{" "}
            <span className="text-teal-400">idea</span> to{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              launch.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
            We follow a proven, transparent process that turns your vision into a powerful digital
            solution.
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <ProcessDevices reduce={reduce} />
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-[0_0_20px_rgba(167,139,250,0.4)]">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M10 2l1.8 3.7L16 6.2l-3 2.9.7 4.1L10 11.3 6.3 13.2l.7-4.1-3-2.9 4.2-.5L10 2z" />
              </svg>
            </span>
            <p className="text-sm font-medium text-slate-200">
              One team. One process. One goal –{" "}
              <span className="font-semibold text-teal-300">Your success.</span>
            </p>
          </div>
        </FadeIn>
      </div>

      <ol className="relative z-[1] space-y-3">
        {detailedProcess.map((step, i) => {
          const meta = stepMeta[i] ?? stepMeta[0];
          return (
            <FadeIn key={step.num} delay={0.04 * i}>
              <li
                className="process-glass-card group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3.5 sm:gap-4 sm:px-4"
                style={{
                  borderColor: `${meta.accent}33`,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 32px -16px ${meta.glow}`,
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, ${meta.accent}14, transparent 55%)`,
                  }}
                  aria-hidden
                />
                <span
                  className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tracking-wider text-white"
                  style={{
                    borderColor: `${meta.accent}66`,
                    background: `linear-gradient(135deg, ${meta.accent}33, rgba(15,23,42,0.9))`,
                    boxShadow: `0 0 18px ${meta.glow}`,
                  }}
                >
                  {step.num}
                </span>
                <span
                  className={`relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${meta.gradient}`}
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" aria-hidden>
                    {meta.icon}
                  </svg>
                </span>
                <div className="relative z-[1] min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold text-white sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    {step.summary}
                  </p>
                </div>
              </li>
            </FadeIn>
          );
        })}
      </ol>
    </div>
  );
}
