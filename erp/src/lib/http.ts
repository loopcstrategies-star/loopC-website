import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AccessError } from "@/server/access/errors";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(
  message: string,
  status = 400,
  code?: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    { error: message, code, ...extra },
    { status },
  );
}

export function handleRouteError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError("Validation failed", 400, "VALIDATION_ERROR", {
      issues: err.issues,
    });
  }

  if (err instanceof AccessError) {
    const status =
      err.code === "UNAUTHORIZED" || err.code === "USER_NOT_FOUND"
        ? 401
        : err.code === "LIMIT_EXCEEDED" || err.code === "FEATURE_DISABLED"
          ? 403
          : 403;
    return jsonError(err.message, status, err.code, err.meta);
  }

  if (err instanceof Error) {
    const code = (err as Error & { code?: string }).code;
    if (code === "UNAUTHORIZED") return jsonError(err.message, 401, code);
    if (code === "FORBIDDEN") return jsonError(err.message, 403, code);
    if (code) return jsonError(err.message, 400, code);
    return jsonError(err.message, 500);
  }

  return jsonError("Internal server error", 500);
}
