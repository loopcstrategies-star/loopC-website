/** URL of the existing LoopC ERP product (not this sales/admin portal). */
export function getExternalErpUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_ERP_APP_URL?.trim() ||
    process.env.ERP_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_EXTERNAL_ERP_URL?.trim() ||
    process.env.EXTERNAL_ERP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  // Dev fallback only — set ERP_APP_URL in production
  return "https://erp.example-domain.com";
}
