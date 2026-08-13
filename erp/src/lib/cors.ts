import { NextResponse } from "next/server";

function allowedOrigins(): string[] {
  const fromEnv = (process.env.PUBLIC_CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const marketing = process.env.MARKETING_URL?.trim();
  const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"];
  return Array.from(
    new Set([
      ...defaults,
      ...(marketing ? [marketing.replace(/\/$/, "")] : []),
      ...fromEnv,
    ]),
  );
}

/** Resolve request Origin against allowlist; fall back to first allowed. */
export function resolvePublicCorsOrigin(requestOrigin?: string | null): string {
  const allowed = allowedOrigins();
  if (requestOrigin && allowed.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowed[0] ?? "http://localhost:3000";
}

/** @deprecated Prefer resolvePublicCorsOrigin(request) */
export const PUBLIC_CORS_ORIGIN = "http://localhost:3000";

export function publicCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": resolvePublicCorsOrigin(requestOrigin),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function withPublicCors(response: NextResponse, requestOrigin?: string | null) {
  const headers = publicCorsHeaders(requestOrigin);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export function publicCorsPreflight(requestOrigin?: string | null) {
  return new NextResponse(null, {
    status: 204,
    headers: publicCorsHeaders(requestOrigin),
  });
}

export function jsonOkPublic<T>(
  data: T,
  init?: ResponseInit,
  requestOrigin?: string | null,
) {
  return withPublicCors(NextResponse.json(data, init), requestOrigin);
}

export function jsonErrorPublic(
  message: string,
  status = 400,
  code?: string,
  extra?: Record<string, unknown>,
  requestOrigin?: string | null,
) {
  return withPublicCors(
    NextResponse.json({ error: message, code, ...extra }, { status }),
    requestOrigin,
  );
}
