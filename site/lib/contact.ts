export const contactServices = [
  { value: "erp", label: "ERP" },
  { value: "custom-software", label: "Custom Software" },
  { value: "web-application", label: "Web Application" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "website", label: "Website" },
  { value: "dashboard", label: "Dashboard" },
  { value: "automation", label: "Automation" },
  { value: "erp-customization", label: "ERP Customization" },
  { value: "saas", label: "SaaS Platform" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "other", label: "Something Else" },
] as const;

export const budgetRanges = [
  { value: "", label: "Prefer not to say" },
  { value: "under-5l", label: "Under ₹5 lakh" },
  { value: "5-15l", label: "₹5–15 lakh" },
  { value: "15-40l", label: "₹15–40 lakh" },
  { value: "40l-plus", label: "₹40 lakh+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export type ContactIntent = "contact" | "project" | "expert";

const slugToService: Record<string, string> = {
  "mobile-app-development": "mobile-app",
  "web-development": "website",
  "web-applications": "web-application",
  "dashboard-development": "dashboard",
  "custom-software": "custom-software",
  "ui-ux": "ui-ux",
  "business-automation": "automation",
  "api-integrations": "automation",
  "support-growth": "other",
  erp: "erp",
  "erp-customization": "erp-customization",
  saas: "saas",
};

export function mapServiceQuery(value?: string): string {
  if (!value) return "";
  if (contactServices.some((item) => item.value === value)) return value;
  return slugToService[value] ?? "";
}

export function mapIntentQuery(value?: string): ContactIntent {
  if (value === "expert" || value === "project") return value;
  return "contact";
}
