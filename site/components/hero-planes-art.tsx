"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

type HeroPlanesArtProps = {
  className?: string;
  scrollTarget: React.RefObject<HTMLElement | null>;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

function PlaneLayer({
  scrollY,
  cursorX,
  cursorY,
  delay,
  reduce,
  children,
}: {
  scrollY: MotionValue<number>;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  delay: number;
  reduce: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <motion.g style={{ y: scrollY }}>
      <motion.g style={{ x: cursorX, y: cursorY }}>
        <motion.g
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay, ease: easeOut }}
        >
          {children}
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

/** LoopC ecosystem visual: Web → Mobile / ERP / Data, connected through the center. */
export function HeroPlanesArt({ className = "", scrollTarget }: HeroPlanesArtProps) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end start"],
  });

  const yBack = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 24]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 52]);
  const yLines = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 72]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 120, damping: 22, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 22, mass: 0.4 });

  const backX = useTransform(springX, (v) => (reduce ? 0 : v * 0.25));
  const backY = useTransform(springY, (v) => (reduce ? 0 : v * 0.25));
  const midX = useTransform(springX, (v) => (reduce ? 0 : v * 0.55));
  const midY = useTransform(springY, (v) => (reduce ? 0 : v * 0.55));
  const linesX = useTransform(springX, (v) => (reduce ? 0 : v * 0.85));
  const linesY = useTransform(springY, (v) => (reduce ? 0 : v * 0.85));
  const frontX = useTransform(springX, (v) => (reduce ? 0 : v * 1.1));
  const frontY = useTransform(springY, (v) => (reduce ? 0 : v * 1.1));

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    cursorX.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    cursorY.set(((e.clientY - r.top) / r.height - 0.5) * 10);
  }

  function onPointerLeave() {
    cursorX.set(0);
    cursorY.set(0);
  }

  return (
    <div ref={wrapRef} className={`absolute inset-0 z-[3] overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-y-0 right-0 hidden w-full max-w-[58%] lg:block"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <linearGradient id="ecoBlob" x1="700" y1="80" x2="1150" y2="700" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d9488" stopOpacity="0.2" />
            <stop offset="1" stopColor="#0f766e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ecoAccent" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#5eead4" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
          <filter id="ecoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <PlaneLayer scrollY={yBack} cursorX={backX} cursorY={backY} delay={0.04} reduce={reduce}>
          <ellipse cx="920" cy="420" rx="340" ry="280" fill="url(#ecoBlob)" />
          <circle cx="920" cy="400" r="120" stroke="rgba(45,212,191,0.12)" strokeWidth="1" fill="none" />
          <circle cx="920" cy="400" r="70" stroke="rgba(45,212,191,0.18)" strokeWidth="1" fill="none" />
        </PlaneLayer>

        {/* Connection lines */}
        <PlaneLayer scrollY={yLines} cursorX={linesX} cursorY={linesY} delay={0.12} reduce={reduce}>
          <path
            d="M920 250 L920 330"
            stroke="rgba(94,234,212,0.55)"
            strokeWidth="1.75"
            strokeDasharray="5 6"
          />
          <path
            d="M920 470 L780 560"
            stroke="rgba(94,234,212,0.45)"
            strokeWidth="1.75"
            strokeDasharray="5 6"
          />
          <path
            d="M920 470 L920 540"
            stroke="rgba(94,234,212,0.5)"
            strokeWidth="1.75"
            strokeDasharray="5 6"
          />
          <path
            d="M920 470 L1060 560"
            stroke="rgba(94,234,212,0.45)"
            strokeWidth="1.75"
            strokeDasharray="5 6"
          />
        </PlaneLayer>

        {/* Nodes */}
        <PlaneLayer scrollY={yMid} cursorX={midX} cursorY={midY} delay={0.18} reduce={reduce}>
          {/* Center LoopC hub */}
          <g filter="url(#ecoGlow)">
            <circle cx="920" cy="400" r="52" fill="rgba(15,23,42,0.75)" stroke="#2dd4bf" strokeWidth="2" />
            <text
              x="920"
              y="396"
              textAnchor="middle"
              fill="#ccfbf1"
              fontSize="13"
              fontFamily="system-ui,sans-serif"
              fontWeight="700"
            >
              LOOPC
            </text>
            <text
              x="920"
              y="414"
              textAnchor="middle"
              fill="rgba(94,234,212,0.75)"
              fontSize="9"
              fontFamily="system-ui,sans-serif"
              letterSpacing="1.5"
            >
              SYSTEMS
            </text>
          </g>

          {/* Web App — top */}
          <g>
            <rect
              x="840"
              y="170"
              width="160"
              height="70"
              rx="14"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(45,212,191,0.5)"
              strokeWidth="1.5"
            />
            <text x="920" y="200" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="system-ui,sans-serif" fontWeight="700">
              WEB APP
            </text>
            <text x="920" y="218" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="system-ui,sans-serif">
              Portals · Dashboards
            </text>
          </g>

          {/* Mobile — bottom left */}
          <g>
            <rect
              x="700"
              y="560"
              width="140"
              height="70"
              rx="14"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(45,212,191,0.45)"
              strokeWidth="1.5"
            />
            <text x="770" y="590" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="system-ui,sans-serif" fontWeight="700">
              MOBILE
            </text>
            <text x="770" y="608" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="system-ui,sans-serif">
              iOS · Android
            </text>
          </g>

          {/* ERP — bottom center */}
          <g>
            <rect
              x="850"
              y="560"
              width="140"
              height="70"
              rx="14"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(45,212,191,0.55)"
              strokeWidth="1.5"
            />
            <text x="920" y="590" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="system-ui,sans-serif" fontWeight="700">
              ERP
            </text>
            <text x="920" y="608" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="system-ui,sans-serif">
              Business system
            </text>
          </g>

          {/* Data — bottom right */}
          <g>
            <rect
              x="1000"
              y="560"
              width="140"
              height="70"
              rx="14"
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(45,212,191,0.45)"
              strokeWidth="1.5"
            />
            <text x="1070" y="590" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="system-ui,sans-serif" fontWeight="700">
              DATA
            </text>
            <text x="1070" y="608" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="system-ui,sans-serif">
              Reports · AI
            </text>
          </g>
        </PlaneLayer>

        <PlaneLayer scrollY={yFront} cursorX={frontX} cursorY={frontY} delay={0.3} reduce={reduce}>
          <circle cx="780" cy="280" r="3" fill="#5eead4" opacity="0.7" />
          <circle cx="1080" cy="300" r="2.5" fill="#14b8a6" opacity="0.75" />
          <circle cx="1120" cy="480" r="3" fill="#99f6e4" opacity="0.5" />
          <circle cx="740" cy="480" r="2" fill="#2dd4bf" opacity="0.65" />
          <circle cx="1180" cy="400" r="2" fill="#ccfbf1" opacity="0.4" />
        </PlaneLayer>
      </svg>
    </div>
  );
}
