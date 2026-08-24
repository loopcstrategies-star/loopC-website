"use client";

import { useEffect, useMemo, useState } from "react";
import { budgetRanges, contactServices } from "@/lib/contact";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  companyWebsite: string;
};

const initial: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  budget: "",
  message: "",
  companyWebsite: "",
};

export function ContactForm({
  defaultService = "",
  defaultIntent = "project",
  turnstileSiteKey = "",
}: {
  defaultService?: string;
  defaultIntent?: "contact" | "project" | "expert";
  turnstileSiteKey?: string;
}) {
  const [form, setForm] = useState<FormState>({ ...initial, service: defaultService });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!turnstileSiteKey) return;
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.body.appendChild(script);
  }, [turnstileSiteKey]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.company.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.service &&
      form.message.trim() &&
      status !== "submitting"
    );
  }, [form, status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const turnstileToken =
        (document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value ?? "");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          service: form.service,
          budget: form.budget,
          message: form.message,
          companyWebsite: form.companyWebsite,
          intent: defaultIntent,
          turnstileToken,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not send your message. Please try again.");
        return;
      }

      setStatus("success");
      setForm({ ...initial, service: defaultService });
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="animate-[fadeUp_0.5s_ease] rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-6 text-slate-800"
      >
        Thank you. We have received your project details and will reply from LoopC.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Company" htmlFor="company">
          <input
            id="company"
            name="company"
            autoComplete="organization"
            required
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project Type" htmlFor="service">
          <select
            id="service"
            name="service"
            required
            value={form.service}
            onChange={(e) => update("service", e.target.value)}
            className={inputClass}
          >
            <option value="">Select a project type</option>
            {contactServices.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget range (optional)" htmlFor="budget">
          <select
            id="budget"
            name="budget"
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            className={inputClass}
          >
            {budgetRanges.map((item) => (
              <option key={item.value || "none"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Project description" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputClass}
        />
      </Field>
      <div className="hidden" aria-hidden>
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyWebsite}
          onChange={(e) => update("companyWebsite", e.target.value)}
        />
      </div>
      {turnstileSiteKey ? (
        <div className="cf-turnstile max-w-full overflow-x-auto" data-sitekey={turnstileSiteKey} />
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-primary inline-flex rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting"
          ? "Sending…"
          : defaultIntent === "expert"
            ? "Talk to an expert"
            : "Send project details"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800">
      {label}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/30 transition duration-200 hover:border-slate-300 focus:border-[var(--primary)] focus:ring-2";
