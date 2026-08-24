"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function HeroVisualImage({
  src = "/images/hero/dashboard.png",
  alt = "LoopC ERP business analytics dashboard showing revenue, sales, inventory and live activity",
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
              className="object-cover object-left-top"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
