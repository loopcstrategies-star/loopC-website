import { getErpPublicUrl } from "@/lib/erp-api";

export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export type SolutionNavItem = {
  href: string;
  label: string;
  description?: string;
};

/** Main header links. */
export const primaryNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/erp", label: "ERP" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export const solutionsNav: SolutionNavItem[] = [
  { href: "/erp", label: "LoopC ERP", description: "Modular business platform" },
  { href: "/services/custom-software", label: "Custom Business Software", description: "Built around your workflow" },
  { href: "/services/web-applications", label: "Web Applications", description: "Portals and platforms" },
  { href: "/services/mobile-app-development", label: "Mobile Applications", description: "Android, iOS, cross-platform" },
  { href: "/services/business-automation", label: "Business Automation", description: "Workflows and integrations" },
  { href: "/services/dashboard-development", label: "Dashboards & Analytics", description: "Operational visibility" },
  { href: "/contact?intent=expert&service=erp-customization", label: "ERP Customization", description: "Extend LoopC ERP" },
];

export function getExpertCta(): NavItem {
  return { href: "/contact", label: "Get Started" };
}

export function getExploreErpCta(): NavItem {
  return { href: "/erp", label: "Explore LoopC ERP" };
}

export function getCustomSoftwareCta(): NavItem {
  return {
    href: "/contact?service=custom-software",
    label: "Start a software project",
  };
}

export function getSalesCta(): NavItem {
  return {
    href: "/contact?service=erp",
    label: "Talk to Sales",
  };
}

export function getCtaNav(): NavItem {
  // Purchase entry is on the marketing site; ERP hosts signup/checkout.
  return {
    href: "/pricing",
    label: "Get Started",
  };
}

export function getLoginNav(): NavItem {
  const erp = getErpPublicUrl();
  return {
    href: `${erp}/login`,
    label: "Login",
    external: true,
  };
}

/** @deprecated Prefer getCtaNav() for ERP-aware CTA */
export const ctaNav: NavItem = {
  href: "/pricing",
  label: "Get Started",
};

export const footerProduct: NavItem[] = [
  { href: "/erp", label: "ERP" },
  { href: "/pricing", label: "Pricing" },
  { href: "/features", label: "ERP Features" },
  { href: "/solutions", label: "Solutions" },
];

export const footerServices: NavItem[] = [
  { href: "/services/web-development", label: "Web Development" },
  { href: "/services/mobile-app-development", label: "Mobile Development" },
  { href: "/services/custom-software", label: "Custom Software" },
  { href: "/services/web-applications", label: "SaaS Development" },
  { href: "/services/dashboard-development", label: "Dashboards" },
  { href: "/services/business-automation", label: "Integrations" },
];

export const footerCompany: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/industries", label: "Industries" },
  { href: "/contact", label: "Contact" },
];

export const footerLegal: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/brochure", label: "Brochure" },
];

/** @deprecated Use footerCompany */
export const footerNav: NavItem[] = footerCompany;
