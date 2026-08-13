export const MODULE_CATALOG = [
  { key: "accounting", label: "Accounting", path: "/app/accounting" },
  { key: "invoicing", label: "Invoicing", path: "/app/invoicing" },
  { key: "sales", label: "Sales", path: "/app/sales" },
  { key: "purchasing", label: "Purchasing", path: "/app/purchasing" },
  { key: "inventory", label: "Inventory", path: "/app/inventory" },
  { key: "crm", label: "CRM", path: "/app/crm" },
  { key: "expenses", label: "Expenses", path: "/app/expenses" },
  { key: "reports_basic", label: "Basic reports", path: "/app/reports" },
  { key: "reports", label: "Reports", path: "/app/reports" },
  { key: "reports_advanced", label: "Advanced reports", path: "/app/reports" },
  { key: "hr", label: "HR", path: "/app/hr" },
  { key: "payroll", label: "Payroll", path: "/app/payroll" },
  { key: "projects", label: "Projects", path: "/app/projects" },
  { key: "api", label: "API access", path: "/app/api-keys" },
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
