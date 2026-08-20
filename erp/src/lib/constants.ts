/** Plan feature keys for the external ERP product — not in-app routes. */
export const MODULE_CATALOG = [
  { key: "accounting", label: "Accounting" },
  { key: "invoicing", label: "Invoicing" },
  { key: "sales", label: "Sales" },
  { key: "purchasing", label: "Purchasing" },
  { key: "inventory", label: "Inventory" },
  { key: "crm", label: "CRM" },
  { key: "expenses", label: "Expenses" },
  { key: "reports_basic", label: "Basic reports" },
  { key: "reports", label: "Reports" },
  { key: "reports_advanced", label: "Advanced reports" },
  { key: "hr", label: "HR" },
  { key: "payroll", label: "Payroll" },
  { key: "projects", label: "Projects" },
  { key: "api", label: "API access" },
] as const;

export type ModuleKey = (typeof MODULE_CATALOG)[number]["key"];

export const LIMIT_KEYS = [
  "users",
  "storage_gb",
  "branches",
  "invoices_per_month",
] as const;

export type LimitKey = (typeof LIMIT_KEYS)[number];

export function formatInr(paise: number | null | undefined): string {
  if (paise == null) return "Custom";
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
