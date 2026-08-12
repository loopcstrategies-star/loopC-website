export function HeroStage() {
  return (
    <div className="relative h-full w-full">
      <div className="hero-float glass-dark absolute left-0 top-6 hidden w-40 rounded-2xl p-3 sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-300">Analytics</p>
        <p className="mt-1 text-xs text-slate-400">Product UI concept</p>
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

      <div className="hero-float-alt absolute right-0 top-0 w-[11.5rem] rounded-[1.6rem] border border-white/15 bg-[#0a1222] p-2 shadow-2xl sm:right-4">
        <div className="rounded-[1.25rem] bg-[#07101c] p-3">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/15" />
          <p className="text-[10px] font-semibold text-slate-400">Field app</p>
          <p className="mt-1 text-sm font-semibold text-white">Today’s jobs</p>
          <div className="mt-3 space-y-2">
            {["Dispatch #1842", "Site check-in", "Collection"].map((row) => (
              <div key={row} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-[11px] text-slate-200">
                {row}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-4 right-8 rounded-2xl border border-white/10 bg-[#0e172a]/90 p-3 shadow-2xl sm:left-16 sm:right-10">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[10px] text-slate-500">loopc.app / operations</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
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
