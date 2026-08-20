import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getExploreErpCta } from "@/lib/navigation";
import { erpModules, erpValueProps, siteConfig } from "@/lib/site-config";

function ErpDashboardMock() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e172a]/90 p-4 shadow-2xl">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400/80" />
        <span className="h-2 w-2 rounded-full bg-amber-400/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[10px] text-slate-500">LoopC ERP · Dashboard</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Revenue", value: "₹12.4L" },
          { label: "Invoices", value: "48" },
          { label: "Stock alerts", value: "6" },
          { label: "Open tasks", value: "14" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] text-slate-400">{kpi.label}</p>
            <p className="text-sm font-semibold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-300">Recent sales</p>
          <div className="mt-2 space-y-1.5">
            {["INV-1042 · Acme Traders", "INV-1041 · Metro Supplies", "INV-1040 · Green Foods"].map((row) => (
              <div key={row} className="rounded border border-white/5 px-2 py-1.5 text-[11px] text-slate-300">
                {row}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-300">Inventory</p>
          <div className="mt-3 flex h-16 items-end gap-1">
            {[55, 72, 48, 85, 60, 90].map((h, i) => (
              <span
                key={i}
                className="w-full origin-bottom rounded-sm bg-teal-400/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-slate-500">Illustrative demo data · Product UI concept</p>
    </div>
  );
}

export function ErpShowcaseSection() {
  const erpCta = getExploreErpCta();

  return (
    <section className="section-dark relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="grain-overlay" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <SectionHeader
            eyebrow="LoopC ERP"
            title={siteConfig.positioning.erpHeadline}
            description={siteConfig.positioning.erpCopy}
            light
          />
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li>— Finance, accounting and invoicing</li>
            <li>— Inventory, sales, purchasing and CRM</li>
            <li>— HR, payroll and operational dashboards</li>
            <li>— Role-based access with web and mobile</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href={erpCta.href}>{erpCta.label}</MagneticButton>
            <MagneticButton href="/pricing" variant="secondary">
              View Pricing
            </MagneticButton>
          </div>
        </FadeIn>
        <FadeIn delay={0.08}>
          <ErpDashboardMock />
        </FadeIn>
      </Container>
    </section>
  );
}

export function ErpModulesGrid({ modules }: { modules?: string[] }) {
  const moduleList = modules?.length ? modules : [...erpModules];

  return (
    <section className="section-light py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="ERP modules"
            title="Start with what you need. Expand when you're ready."
            description="LoopC ERP is modular — finance, operations, people and reporting connected from day one."
          />
        </FadeIn>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {moduleList.map((name, index) => (
            <FadeIn key={name} delay={index * 0.03}>
              <li className="lift-card rounded-2xl border border-slate-200/80 bg-white px-4 py-4 text-center text-sm font-medium text-slate-800 shadow-sm">
                {name}
              </li>
            </FadeIn>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-slate-500">
          Module availability depends on your plan.{" "}
          <Link href="/features" className="font-semibold text-teal-700 hover:underline">
            Compare features
          </Link>
        </p>
      </Container>
    </section>
  );
}

export function ErpValueProps() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Why LoopC ERP"
            title="One connected system for your entire business."
            description="Replace disconnected tools and manual processes with a platform built to grow with you."
            light
            align="center"
            className="mx-auto text-center"
          />
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {erpValueProps.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05}>
              <div className="lift-card h-full rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
