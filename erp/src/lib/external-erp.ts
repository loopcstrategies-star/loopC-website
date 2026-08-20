/** URL of the existing LoopC ERP product (not this sales/admin app). */
export function getExternalErpUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_EXTERNAL_ERP_URL?.trim() ||
    process.env.EXTERNAL_ERP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://app.loopcstrategies.com";
}
