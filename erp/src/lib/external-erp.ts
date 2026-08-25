/** URL of the existing LoopC ERP product (not this sales/admin portal). */

function readExternalErpEnv(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_ERP_APP_URL?.trim() ||
    process.env.ERP_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_EXTERNAL_ERP_URL?.trim() ||
    process.env.EXTERNAL_ERP_URL?.trim() ||
    "";
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

/**
 * Returns the configured external ERP origin, or `null` when unset.
 * Never falls back to example/demo domains — production must set ERP_APP_URL.
 */
export function getExternalErpUrl(): string | null {
  return readExternalErpEnv();
}

/** True when Open ERP can safely link to a configured product URL. */
export function hasExternalErpUrl(): boolean {
  return Boolean(readExternalErpEnv());
}
