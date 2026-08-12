import { NextResponse } from "next/server";
import { z } from "zod";
import { contactServices } from "@/lib/contact";
import { siteConfig } from "@/lib/site-config";

const MAX_BODY_BYTES = 20_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

const serviceValues = contactServices.map((item) => item.value) as [string, ...string[]];

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(40),
  service: z.enum(serviceValues),
  budget: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(10).max(4000),
  intent: z.string().trim().max(40).optional().default("project"),
  companyWebsite: z.string().max(200).optional().default(""),
  turnstileToken: z.string().optional().default(""),
});

const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = [
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""),
    siteConfig.productionUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean);
  return allowed.some((item) => origin === item);
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });
  }

  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader && Number(lengthHeader) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const data = parsed.data;
  if (data.companyWebsite.trim()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json({ error: "Please complete the verification and try again." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  const formspreeId = process.env.FORMSPREE_FORM_ID?.trim();
  const contactEmail = process.env.CONTACT_TO_EMAIL?.trim();

  if (!formspreeId && !contactEmail) {
    console.error("Contact form is not configured (missing FORMSPREE_FORM_ID or CONTACT_TO_EMAIL).");
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const payload = {
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    service: data.service,
    budget: data.budget,
    message: data.message,
    intent: data.intent,
    _subject: `[${siteConfig.brand}] ${data.service} from ${data.company}`,
    _template: "table",
    _replyto: data.email,
  };

  const endpoint = formspreeId
    ? `https://formspree.io/f/${formspreeId}`
    : `https://formsubmit.co/ajax/${encodeURIComponent(contactEmail!)}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Contact delivery failed", { service: data.service, intent: data.intent, status: res.status });
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 502 },
      );
    }

    console.info("Contact enquiry received", { service: data.service, intent: data.intent });
    return NextResponse.json({ ok: true });
  } catch {
    console.error("Contact delivery network error", { service: data.service });
    return NextResponse.json({ error: "Network error. Please try again." }, { status: 500 });
  }
}
