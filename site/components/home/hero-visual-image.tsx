"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function HeroVisualImage({
  src = "/images/hero/dashboard.png",
  alt = "LoopC business dashboard showing revenue, sales, inventory and live activity",
}: {
  src?: string;
  alt?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-full overflow-x-hidden lg:max-w-none">
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-600/40 via-violet-600/25 to-cyan-500/20 blur-3xl ${reduce ? "" : "hero-glow-pulse"}`}
        aria-hidden
      />

      <motion.div
        className={`hero-dashboard-frame relative z-10 ${reduce ? "" : "hero-dashboard-float"}`}
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`browser-frame hero-image-glow ${reduce ? "" : "hero-image-hover"}`}>
          <div className="browser-frame-bar">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 truncate text-[10px] text-slate-500">loopc.app / operations</span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${reduce ? "" : "hero-live-dot"}`} />
              Live
            </span>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0b1224]">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="scale-[1.06] object-cover object-left-top"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="hero-float absolute -left-1 top-8 z-20 hidden w-44 rounded-xl border border-white/10 bg-[#0f172a]/95 p-3.5 shadow-xl shadow-blue-950/40 backdrop-blur-xl lg:block"
        initial={reduce ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
      >
        <p className="text-[10px] font-semibold text-cyan-300">Revenue</p>
        <p className="mt-1 text-lg font-bold text-white">+18.4%</p>
        <p className="text-[10px] text-slate-400">vs last month</p>
      </motion.div>

      <motion.div
        className="hero-float-alt absolute -right-1 top-24 z-20 hidden w-48 rounded-xl border border-white/10 bg-[#0f172a]/95 p-3.5 shadow-xl shadow-violet-950/40 backdrop-blur-xl lg:block"
        initial={reduce ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
      >
        <p className="text-[10px] font-semibold text-violet-300">CRM · New lead</p>
        <p className="mt-1 text-xs text-slate-200">Acme Corp enquiry</p>
        <p className="text-[10px] text-slate-500">Just now</p>
      </motion.div>

      <motion.div
        className="hero-float-slow absolute bottom-4 left-8 z-20 hidden rounded-xl border border-white/10 bg-[#0f172a]/95 px-3.5 py-2.5 shadow-xl shadow-blue-950/40 backdrop-blur-xl lg:flex lg:items-center lg:gap-2.5"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white shadow-md shadow-blue-500/30">
          A
        </span>
        <div>
          <p className="text-[10px] font-semibold text-white">Team activity</p>
          <p className="text-[10px] text-slate-400">3 online now</p>
        </div>
      </motion.div>
    </div>
  );
}
