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
  return <p className="type-label text-blue-600">{children}</p>;
}

export function SectionLabelLight({ children }: { children: React.ReactNode }) {
  return <p className="type-label text-blue-300/90">{children}</p>;
}
