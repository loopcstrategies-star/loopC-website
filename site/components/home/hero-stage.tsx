import Image from "next/image";

/**
 * Hero visual composition. Drop real assets into public/images/ when available:
 * - erp/dashboard.webp
 * - mobile/field-app.webp
 * - placeholders/analytics.webp
 */
export function HeroStage() {
  return (
    <div className="relative flex flex-col gap-4 lg:block lg:h-full">
      <div className="hero-float glass-dark relative hidden w-full max-w-[10rem] rounded-2xl p-3 sm:block lg:absolute lg:left-0 lg:top-6 lg:w-40">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">Analytics</p>
        <p className="mt-1 text-xs text-slate-400">Dashboard view</p>
        <div className="relative mt-3 h-12 overflow-hidden rounded-lg bg-white/5">
          <Image
            src="/images/placeholders/analytics.svg"
            alt=""
            fill
            className="object-cover opacity-80"
            sizes="160px"
          />
        </div>
        <div className="mt-3 flex h-12 items-end gap-1">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <span
              key={i}
              className="w-full origin-bottom rounded-sm bg-teal-400/70"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div className="hero-float-alt relative mx-auto w-full max-w-[12rem] rounded-[1.6rem] border border-white/15 bg-[#0a1222] p-2 shadow-2xl sm:max-w-[11.5rem] lg:absolute lg:right-4 lg:top-0 lg:mx-0">
        <div className="rounded-[1.25rem] bg-[#07101c] p-3">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/15" />
          <p className="text-[10px] font-semibold text-slate-400">Mobile ERP</p>
          <p className="mt-1 text-sm font-semibold text-white">Today&apos;s jobs</p>
          <div className="mt-3 space-y-2">
            {["Dispatch #1842", "Site check-in", "Collection"].map((row) => (
              <div
                key={row}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-[11px] text-slate-200"
              >
                {row}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-[#0e172a]/90 p-3 shadow-2xl lg:absolute lg:bottom-2 lg:left-16 lg:right-10">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-0 truncate text-[10px] text-slate-500 sm:ml-2">loopc.app / operations</span>
        </div>
        <div className="relative mb-2 h-24 overflow-hidden rounded-lg border border-white/5 bg-white/5">
          <Image
            src="/images/placeholders/erp-dashboard.svg"
            alt=""
            fill
            className="object-cover object-left-top opacity-90"
            sizes="(max-width: 768px) 100vw, 480px"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { label: "Orders", value: "128" },
            { label: "Open", value: "14" },
            { label: "SLA", value: "98%" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg bg-white/5 p-2">
              <p className="text-[10px] text-slate-400">{kpi.label}</p>
              <p className="text-sm font-semibold text-white">{kpi.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-slate-500">Illustrative demo data · Product UI concept</p>
      </div>
    </div>
  );
}
