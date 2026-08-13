import { getErpPublicUrl } from "@/lib/erp-api";

export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/erp", label: "ERP" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function getCtaNav(): NavItem {
  const erp = getErpPublicUrl();
  return {
    href: `${erp}/pricing`,
    label: "Get Started",
    external: true,
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

export const footerNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/erp", label: "ERP" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const footerLegal: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/brochure", label: "Brochure" },
];
