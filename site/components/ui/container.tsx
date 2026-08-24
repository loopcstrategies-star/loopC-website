export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex rounded-full border border-blue-200/50 bg-blue-50/70 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-blue-600 uppercase">
      {children}
    </p>
  );
}

export function SectionLabelLight({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-blue-300 uppercase">
      {children}
    </p>
  );
}
