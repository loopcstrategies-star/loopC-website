"use client";

import { motion, useReducedMotion } from "framer-motion";

const nodes = [
  { label: "Web App", x: 300, y: 48, gold: false },
  { label: "Mobile App", x: 88, y: 280, gold: false },
  { label: "ERP System", x: 300, y: 300, gold: true },
  { label: "Business Data", x: 512, y: 280, gold: false },
  { label: "Management", x: 300, y: 470, gold: true },
] as const;

/** Laptop + phone + connected-system nodes — no people, product-first. */
export function HeroShowcase({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative mx-auto aspect-[5/4] w-full max-w-xl lg:max-w-none ${className}`}>
      {/* Soft teal glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/20 blur-3xl"
        aria-hidden
      />

      {/* Connection graph + traveling dots */}
      <svg
        className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
        viewBox="0 0 600 520"
        fill="none"
        aria-hidden
      >
        <path
          id="path-web"
          d="M300 70 L300 160"
          stroke="rgba(45,212,191,0.35)"
          strokeWidth="1.5"
        />
        <path
          id="path-mobile"
          d="M300 200 L120 270"
          stroke="rgba(45,212,191,0.3)"
          strokeWidth="1.5"
        />
        <path
          id="path-erp"
          d="M300 200 L300 280"
          stroke="rgba(45,212,191,0.4)"
          strokeWidth="1.5"
        />
        <path
          id="path-data"
          d="M300 200 L480 270"
          stroke="rgba(45,212,191,0.3)"
          strokeWidth="1.5"
        />
        <path
          id="path-mgmt"
          d="M300 320 L300 450"
          stroke="rgba(212,175,55,0.35)"
          strokeWidth="1.5"
        />

        {!reduce ? (
          <>
            <circle r="3.5" fill="#2dd4bf">
              <animateMotion dur="4s" repeatCount="indefinite" path="M300 70 L300 160" />
            </circle>
            <circle r="3" fill="#5eead4">
              <animateMotion dur="5s" begin="0.4s" repeatCount="indefinite" path="M300 200 L120 270" />
            </circle>
            <circle r="3" fill="#fbbf24">
              <animateMotion dur="4.5s" begin="0.8s" repeatCount="indefinite" path="M300 200 L480 270" />
            </circle>
            <circle r="3.5" fill="#f59e0b">
              <animateMotion dur="5.5s" begin="0.2s" repeatCount="indefinite" path="M300 320 L300 450" />
            </circle>
          </>
        ) : null}

        {nodes.map((n) => (
          <g key={n.label}>
            <circle
              cx={n.x}
              cy={n.y}
              r="5"
              fill={n.gold ? "#fbbf24" : "#2dd4bf"}
              opacity="0.9"
            />
            <circle
              cx={n.x}
              cy={n.y}
              r="10"
              stroke={n.gold ? "rgba(251,191,36,0.35)" : "rgba(45,212,191,0.3)"}
              strokeWidth="1"
              fill="none"
            />
          </g>
        ))}
      </svg>

      {/* Node labels */}
      {nodes.map((n) => (
        <div
          key={n.label}
          className="glass-dark absolute z-20 hidden rounded-xl px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-teal-50 sm:block"
          style={{
            left: `${(n.x / 600) * 100}%`,
            top: `${(n.y / 520) * 100}%`,
            transform: "translate(-50%, -130%)",
          }}
        >
          <span
            className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${n.gold ? "bg-amber-400" : "bg-teal-400"}`}
          />
          {n.label}
        </div>
      ))}

      {/* Laptop — slow float */}
      <div className={`absolute left-[10%] top-[14%] z-10 w-[72%] ${reduce ? "" : "hero-float"}`}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-t-xl border border-white/15 bg-slate-900/90 p-2 shadow-2xl shadow-teal-950/50 backdrop-blur-md sm:p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              </div>
              <span className="text-[9px] font-semibold tracking-wide text-teal-300/80">
                LoopC ERP
              </span>
            </div>
            <div className="overflow-hidden rounded-lg bg-white">
              <div className="flex min-h-[150px] sm:min-h-[190px]">
                <aside className="w-12 bg-slate-900 p-2 sm:w-16">
                  <div className="mb-3 h-2 w-8 rounded bg-gradient-to-r from-teal-400 to-amber-300" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="h-1.5 w-full rounded bg-white/15" />
                    ))}
                  </div>
                </aside>
                <div className="flex-1 p-2.5 sm:p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-2 w-16 rounded bg-slate-200" />
                    <div className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[8px] font-bold text-teal-700">
                      Live
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: "Sales", tone: "bg-teal-50" },
                      { label: "Stock", tone: "bg-sky-50" },
                      { label: "Profit", tone: "bg-amber-50" },
                    ].map((c) => (
                      <div key={c.label} className={`rounded-lg ${c.tone} p-1.5`}>
                        <div className="text-[7px] font-semibold text-slate-500">{c.label}</div>
                        <div className="mt-1 h-3 w-8 rounded bg-slate-800/70" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex h-14 items-end gap-1 rounded-lg bg-slate-50 p-2 sm:h-[4.5rem]">
                    {[40, 65, 45, 80, 55, 90, 70, 60].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-teal-600 to-teal-300"
                        style={
                          reduce
                            ? { height: `${h}%` }
                            : {
                                height: `${h}%`,
                                animation: `bar-grow 1.2s ease-out ${0.4 + i * 0.06}s both`,
                              }
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto h-2 w-[88%] rounded-b-md bg-slate-800" />
          <div className="mx-auto h-1.5 w-[40%] rounded-b-full bg-slate-700" />
        </motion.div>
      </div>

      {/* Phone — opposite float */}
      <div
        className={`absolute bottom-[4%] right-[2%] z-20 w-[30%] min-w-[100px] max-w-[136px] ${reduce ? "" : "hero-float-alt"}`}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="overflow-hidden rounded-[1.4rem] border-2 border-white/20 bg-slate-950 shadow-2xl shadow-teal-900/40">
            <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-white/20" />
            <div className="space-y-2 p-2.5">
              <div className="flex items-center justify-between">
                <div className="h-2 w-12 rounded bg-teal-400/70" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <div className="rounded-xl bg-white/5 p-2">
                <div className="h-1.5 w-10 rounded bg-white/30" />
                <div className="mt-2 h-8 rounded-lg bg-gradient-to-br from-teal-500/40 to-amber-400/20" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-10 rounded-lg bg-white/5" />
                <div className="h-10 rounded-lg bg-white/5" />
              </div>
              <div className="h-1.5 w-full rounded bg-white/10" />
              <div className="h-1.5 w-3/4 rounded bg-white/10" />
            </div>
            <div className="flex justify-around border-t border-white/10 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
