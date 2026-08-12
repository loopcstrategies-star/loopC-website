export const contactServices = [
  { value: "mobile-app", label: "Mobile App" },
  { value: "website", label: "Website" },
  { value: "web-application", label: "Web Application" },
  { value: "dashboard", label: "Dashboard" },
  { value: "custom-software", label: "Custom Software" },
  { value: "ui-ux", label: "UI/UX" },
  { value: "automation", label: "Automation" },
  { value: "other", label: "Other" },
] as const;

export const budgetRanges = [
  { value: "", label: "Prefer not to say" },
  { value: "under-5l", label: "Under ₹5 lakh" },
  { value: "5-15l", label: "₹5–15 lakh" },
  { value: "15-40l", label: "₹15–40 lakh" },
  { value: "40l-plus", label: "₹40 lakh+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export type ContactIntent = "contact" | "project";

const slugToService: Record<string, string> = {
  "mobile-app-development": "mobile-app",
  "web-development": "website",
  "web-applications": "web-application",
  "dashboard-development": "dashboard",
  "custom-software": "custom-software",
  "ui-ux": "ui-ux",
  "business-automation": "automation",
  "api-integrations": "other",
  "support-growth": "other",
};

export function mapServiceQuery(value?: string): string {
  if (!value) return "";
  if (contactServices.some((item) => item.value === value)) return value;
  return slugToService[value] ?? "";
}
