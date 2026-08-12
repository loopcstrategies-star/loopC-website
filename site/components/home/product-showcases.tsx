"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { Container, SectionLabel } from "@/components/ui/container";

const phoneScreens = [
  { id: "login", title: "Login", rows: ["Staff ID", "••••••••", "Continue"] },
  { id: "dashboard", title: "Dashboard", rows: ["Jobs today · 6", "On route · 2", "Done · 4"] },
  { id: "analytics", title: "Analytics", rows: ["Visits 128", "Avg time 4m", "Repeat 41%"] },
  { id: "customer", title: "Customer", rows: ["Priya N.", "Open ticket", "Last visit Tue"] },
  { id: "notifications", title: "Notifications", rows: ["Dispatch ready", "Payment due", "New lead"] },
  { id: "transactions", title: "Transactions", rows: ["₹12,400", "₹3,250", "₹8,900"] },
];

export function ProductShowcases() {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setScreen((value) => (value + 1) % phoneScreens.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  const current = phoneScreens[screen];

  return (
    <div className="bg-[#f4f6fa]">
      <section className="py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <SectionLabel>05 — Mobile</SectionLabel>
            <h2 className="type-h2 mt-3 font-bold text-slate-950">Apps people will actually open.</h2>
            <p className="mt-4 text-slate-600">
              Native-quality mobile experiences for customers, employees and field teams. The
              screens here are a product UI concept — not a client’s live data.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {phoneScreens.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScreen(index)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    screen === index
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="flex justify-center gap-4">
            <PhoneFrame title={current.title} rows={current.rows} />
            <PhoneFrame
              title={phoneScreens[(screen + 2) % phoneScreens.length].title}
              rows={phoneScreens[(screen + 2) % phoneScreens.length].rows}
              offset
            />
          </FadeIn>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-white py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn className="order-2 lg:order-1">
            <BrowserMock />
          </FadeIn>
          <FadeIn className="order-1 lg:order-2">
            <SectionLabel>06 — Websites</SectionLabel>
            <h2 className="type-h2 mt-3 font-bold text-slate-950">
              Sites built for credibility, discovery and conversion.
            </h2>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>Responsive design across desktop, tablet and mobile</li>
              <li>SEO-ready architecture</li>
              <li>Fast loading and conversion-focused UX</li>
              <li>CMS integration where editors need control</li>
              <li>Analytics on the paths that matter</li>
            </ul>
          </FadeIn>
        </Container>
      </section>

      <section className="border-t border-slate-200 py-20 sm:py-24">
        <Container>
          <FadeIn>
            <SectionLabel>07 — Dashboards</SectionLabel>
            <h2 className="type-h2 mt-3 max-w-2xl font-bold text-slate-950">
              Numbers leadership can act on.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              KPIs, charts, activity and reports — illustrative demo data, labelled as a product
              UI concept.
            </p>
          </FadeIn>
          <FadeIn delay={0.08} className="mt-10">
            <DashboardMock />
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}

function PhoneFrame({
  title,
  rows,
  offset = false,
}: {
  title: string;
  rows: string[];
  offset?: boolean;
}) {
  return (
    <div
      className={`w-40 rounded-[1.6rem] border border-slate-800 bg-[#0b1220] p-2 shadow-2xl ${
        offset ? "mt-10 hidden sm:block" : ""
      }`}
    >
      <div className="rounded-[1.2rem] bg-[#071018] p-3">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20" />
        <p className="text-[10px] font-semibold text-teal-300">Product UI concept</p>
        <p className="mt-1 text-sm font-semibold text-white">{title}</p>
        <div className="mt-3 space-y-2">
          {rows.map((row) => (
            <div key={row} className="rounded-lg bg-white/5 px-2 py-2 text-[11px] text-slate-200">
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrowserMock() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-xl">
      <div className="mb-2 flex items-center gap-1.5 px-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-2 flex-1 rounded-full bg-white px-3 py-1 text-[11px] text-slate-500">
          loopc.com
        </span>
      </div>
      <div className="grid gap-2 rounded-xl bg-white p-4 sm:grid-cols-[1fr_0.7fr]">
        <div>
          <div className="h-3 w-24 rounded bg-teal-100" />
          <div className="mt-3 h-8 w-4/5 rounded bg-slate-100" />
          <div className="mt-2 h-2 w-full rounded bg-slate-100" />
          <div className="mt-2 h-2 w-2/3 rounded bg-slate-100" />
          <div className="mt-4 h-8 w-28 rounded-full bg-teal-600/80" />
        </div>
        <div className="hidden rounded-xl bg-slate-50 p-3 sm:block">
          <div className="h-20 rounded-lg bg-slate-200/80" />
          <p className="mt-2 text-[10px] text-slate-500">Desktop · tablet · mobile</p>
        </div>
      </div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Operations overview</p>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
          Product UI concept
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Revenue", value: "₹18.4L" },
          { label: "Orders", value: "1,248" },
          { label: "Users", value: "86" },
          { label: "Open jobs", value: "23" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{kpi.label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="flex h-36 items-end gap-2 rounded-2xl bg-slate-50 p-4">
          {[40, 55, 38, 72, 60, 88, 70, 92, 64, 80].map((h, i) => (
            <span
              key={i}
              className="w-full rounded-sm bg-teal-500/70"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-semibold text-slate-500">Activity</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Order #4412 packed</li>
            <li>Report exported</li>
            <li>Filter: This week</li>
          </ul>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-slate-400">Illustrative demo data. Not client results.</p>
    </div>
  );
}
