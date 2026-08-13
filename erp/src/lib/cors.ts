import { NextResponse } from "next/server";

/** Marketing site (Next on :3000) may call ERP public APIs (:3001). */
export const PUBLIC_CORS_ORIGIN = "http://localhost:3000";

export function publicCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": PUBLIC_CORS_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function withPublicCors(response: NextResponse) {
  const headers = publicCorsHeaders();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export function publicCorsPreflight() {
  return new NextResponse(null, {
    status: 204,
    headers: publicCorsHeaders(),
  });
}

export function jsonOkPublic<T>(data: T, init?: ResponseInit) {
  return withPublicCors(NextResponse.json(data, init));
}

export function jsonErrorPublic(
  message: string,
  status = 400,
  code?: string,
  extra?: Record<string, unknown>,
) {
  return withPublicCors(
    NextResponse.json({ error: message, code, ...extra }, { status }),
  );
}
