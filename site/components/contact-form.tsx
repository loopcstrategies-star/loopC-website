"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

export type FormIntent = "contact" | "demo" | "audit" | "consultation" | "brochure";

type ContactFormProps = {
  className?: string;
  intent?: FormIntent;
  /** After successful brochure submit, trigger download */
  onBrochureSuccess?: () => void;
};

const intentLabels: Record<FormIntent, { subject: string; button: string; intro: string }> = {
  contact: {
    subject: "Contact",
    button: "Submit request",
    intro: "Tell us about your next system — we'll recommend web, mobile, ERP or custom.",
  },
  demo: {
    subject: "Demo request",
    button: "Book free demo",
    intro: "LoopC ERP demo or custom project scoping — tell us which and we'll schedule a call.",
  },
  audit: {
    subject: "Free audit request",
    button: "Request free audit",
    intro: "Get a free business process audit—inventory, purchases, sales, and accounts.",
  },
  consultation: {
    subject: "Free consultation",
    button: "Book free consultation",
    intro: "Find inventory leakage and profit loss areas with a focused consultation.",
  },
  brochure: {
    subject: "Brochure download",
    button: "Download brochure",
    intro: "Enter your details to download the LoopC ERP product brochure.",
  },
};

const needOptions = [
  { value: "", label: "What do you need?" },
  { value: "web", label: "Web Application" },
  { value: "mobile", label: "Mobile Application" },
  { value: "erp", label: "ERP" },
  { value: "custom", label: "Custom Software" },
  { value: "improve", label: "Existing System Improvement" },
  { value: "other", label: "Other" },
] as const;

const employeeOptions = [
  { value: "", label: "Select team size" },
  { value: "1-10", label: "1–10 employees" },
  { value: "11-25", label: "11–25 employees" },
  { value: "26-50", label: "26–50 employees" },
  { value: "51-100", label: "51–100 employees" },
  { value: "100+", label: "100+ employees" },
];

export function ContactForm({
  className = "",
  intent = "contact",
  onBrochureSuccess,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const meta = intentLabels[intent];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const mobile = String(fd.get("mobile") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const need = String(fd.get("need") ?? "").trim();
    const employees = String(fd.get("employees") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!email) {
      setStatus("error");
      return;
    }

    const subjectPrefix = `[${siteConfig.brand}] ${meta.subject}`;
    const payload = {
      name,
      company,
      mobile,
      email,
      need,
      employees,
      message,
      intent,
      _subject: `${subjectPrefix} from ${company || name || email}`,
    };

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        if (intent === "brochure") onBrochureSuccess?.();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={className}>
      <p className="text-sm text-slate-600">{meta.intro}</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-teal-600/15 focus:border-teal-500 focus:ring-4"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Company name
            <input
              name="company"
              type="text"
              required
              autoComplete="organization"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-teal-600/15 focus:border-teal-500 focus:ring-4"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Mobile number
            <input
              name="mobile"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+91"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-teal-600/15 focus:border-teal-500 focus:ring-4"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-teal-600/15 focus:border-teal-500 focus:ring-4"
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          What do you need?
          <select
            name="need"
            required
            defaultValue=""
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-teal-600/15 focus:border-teal-500 focus:ring-4"
          >
            {needOptions.map((o) => (
              <option key={o.value || "empty"} value={o.value} disabled={!o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Number of employees
          <select
            name="employees"
            defaultValue=""
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-teal-600/15 focus:border-teal-500 focus:ring-4"
          >
            {employeeOptions.map((o) => (
              <option key={o.value || "empty"} value={o.value} disabled={!o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {intent === "contact" || intent === "demo" ? (
          <label className="block text-sm font-medium text-slate-700">
            Message <span className="font-normal text-slate-500">(optional)</span>
            <textarea
              name="message"
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-teal-600/15 focus:border-teal-500 focus:ring-4"
              placeholder="Brief context — current tools, timeline, branch count…"
            />
          </label>
        ) : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="interactive-shine inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:brightness-105 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Sending…" : meta.button}
        </button>
        {status === "success" ? (
          <p className="text-sm font-medium text-teal-800" role="status">
            {intent === "brochure"
              ? "Thanks — your brochure download should start shortly."
              : "Thanks — we received your request and will be in touch soon."}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            Something went wrong. Please try again or email {siteConfig.salesEmail}.
          </p>
        ) : null}
      </form>
    </div>
  );
}
