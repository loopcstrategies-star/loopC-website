"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  onMount?: boolean;
  scale?: boolean;
};

export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 18,
  onMount = false,
  scale = false,
}: FadeInProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const transition = { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const };
  const initial = scale ? { opacity: 0, scale: 0.96, y: y * 0.4 } : { opacity: 0, y };
  const animate = scale ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, y: 0 };

  if (onMount) {
    return (
      <motion.div
        className={className}
        initial={initial}
        animate={animate}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "0px 0px -32px 0px", amount: 0.05 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -24px 0px", amount: 0.05 }}
      variants={staggerChildren}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  scale = false,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={scale ? scaleIn : fadeUp}>
      {children}
    </motion.div>
  );
}
