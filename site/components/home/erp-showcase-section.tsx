import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Container } from "@/components/ui/container";
import { getExploreErpCta } from "@/lib/navigation";
import { erpModules, erpValueProps } from "@/lib/site-config";

const floatingFeatures = ["Finance", "CRM", "Inventory", "HR", "Sales", "Reports"];

function ErpDashboardMock() {
  return (
    <div className="relative">
      <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/95 p-4 shadow-2xl">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[10px] text-slate-500">LoopC ERP · Dashboard</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Revenue", value: "₹12.4L", tone: "text-blue-300" },
            { label: "Invoices", value: "48", tone: "text-violet-300" },
            { label: "Stock alerts", value: "6", tone: "text-cyan-300" },
            { label: "Open tasks", value: "14", tone: "text-blue-300" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg bg-white/5 p-3">
              <p className="text-[10px] text-slate-400">{kpi.label}</p>
              <p className={`text-sm font-semibold ${kpi.tone}`}>{kpi.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
              Recent sales
            </p>
            <div className="mt-2 space-y-1.5">
              {["INV-1042 · Acme Traders", "INV-1041 · Metro Supplies", "INV-1040 · Green Foods"].map(
                (row) => (
                  <div
                    key={row}
                    className="rounded border border-white/5 px-2 py-1.5 text-[11px] text-slate-300"
                  >
                    {row}
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">
              Inventory
            </p>
            <div className="mt-3 flex h-16 items-end gap-1">
              {[55, 72, 48, 85, 60, 90].map((h, i) => (
                <span
                  key={i}
                  className="w-full origin-bottom rounded-sm bg-gradient-to-t from-blue-600 to-violet-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-slate-500">Illustrative demo data · Product UI concept</p>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:absolute lg:-left-4 lg:top-8 lg:mt-0 lg:flex-col">
        {floatingFeatures.slice(0, 3).map((f) => (
          <li
            key={f}
            className="rounded-xl border border-white/10 bg-[var(--dark)]/90 px-3 py-2 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur"
          >
            {f}
          </li>
        ))}
      </ul>
      <ul className="mt-2 flex flex-wrap justify-center gap-2 lg:absolute lg:-right-4 lg:bottom-12 lg:mt-0 lg:flex-col">
        {floatingFeatures.slice(3).map((f) => (
          <li
            key={f}
            className="rounded-xl border border-white/10 bg-[var(--dark)]/90 px-3 py-2 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur"
          >
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ErpShowcaseSection() {
  const erpCta = getExploreErpCta();

  return (
    <section className="section-dark relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="grain-overlay" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="type-label text-blue-300">LoopC ERP</p>
          <h2 className="type-h2 mt-3 font-bold text-white">Your Business. One Connected Platform.</h2>
          <p className="mt-4 max-w-xl text-slate-300">
            Powerful business software designed to bring your operations, data and teams together.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li>— Finance, accounting and invoicing</li>
            <li>— Inventory, sales, purchasing and CRM</li>
            <li>— HR, payroll and operational dashboards</li>
            <li>— Role-based access with web and mobile</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href={erpCta.href}>{erpCta.label}</MagneticButton>
            <MagneticButton href="/pricing" variant="dark">
              View Plans
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

export function ErpValueProps() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <Container>
        <FadeIn>
          <p className="type-label mx-auto text-center text-blue-300">Why LoopC ERP</p>
          <h2 className="type-h2 mx-auto mt-3 max-w-2xl text-center font-bold text-white">
            One connected system for your entire business.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-300">
            Replace disconnected tools and manual processes with a platform built to grow with you.
          </p>
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

export function WhyChooseUsSection() {
  const items = [
    {
      title: "Product-minded delivery",
      description: "We design and ship software like a product team — not a ticket factory.",
    },
    {
      title: "Business software expertise",
      description: "ERP, CRM, dashboards and automation for real operational workflows.",
    },
    {
      title: "Clear process",
      description: "Discover, design, build and support with transparent milestones.",
    },
    {
      title: "Long-term partnership",
      description: "We stay after launch for improvements, reliability and growth.",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <p className="type-label text-[var(--primary)]">Why choose us</p>
          <h2 className="type-h2 mt-3 max-w-2xl font-bold text-[var(--text)]">
            A technology partner built for serious products.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Premium engineering with business context — so your software actually moves operations
            forward.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05}>
              <div className="lift-card h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
                <h3 className="text-lg font-semibold text-[var(--text)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
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
          <p className="type-label text-[var(--primary)]">ERP modules</p>
          <h2 className="type-h2 mt-3 font-bold text-[var(--text)]">
            Start with what you need. Expand when you&apos;re ready.
          </h2>
        </FadeIn>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {moduleList.map((name, index) => (
            <FadeIn key={name} delay={index * 0.03}>
              <li className="lift-card rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-center text-sm font-medium text-slate-800 shadow-sm">
                {name}
              </li>
            </FadeIn>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Module availability depends on your plan.{" "}
          <Link href="/features" className="font-semibold text-[var(--primary)] hover:underline">
            Compare features
          </Link>
        </p>
      </Container>
    </section>
  );
}
