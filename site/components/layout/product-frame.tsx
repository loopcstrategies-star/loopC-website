import Image from "next/image";

export function ProductFrame({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`browser-frame hero-image-glow hero-image-hover ${className}`}>
      <div className="browser-frame-bar">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 truncate text-[10px] text-slate-500">{caption ?? "loopc.app"}</span>
        <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 sm:inline-flex">
          <span className="hero-live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full bg-[#0b1224]">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top" />
      </div>
    </figure>
  );
}
