/** Server-side fetch helper for the LoopC ERP public API (CMS + plans). */

export function getErpApiUrl(): string {
  const raw =
    process.env.ERP_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_ERP_URL?.trim() ||
    "http://localhost:3001";
  return raw.replace(/\/$/, "");
}

export function getErpPublicUrl(): string {
  const raw = process.env.NEXT_PUBLIC_ERP_URL?.trim() || "http://localhost:3001";
  return raw.replace(/\/$/, "");
}

export async function erpFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const base = getErpApiUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const method = (init?.method ?? "GET").toUpperCase();
  const isGet = method === "GET" || method === "HEAD";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
      signal: init?.signal ?? controller.signal,
      ...(isGet ? { next: { revalidate: 30 } } : { cache: "no-store" as const }),
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Prices in DB are INR paise (e.g. 199900 → ₹1,999). */
export function formatInrFromPaise(paise: number | null | undefined): string {
  if (paise == null) return "Custom";
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export type ErpPlanFeature = {
  id: string;
  moduleKey: string;
  enabled: boolean;
  label: string | null;
};

export type ErpPlanLimit = {
  id: string;
  limitKey: string;
  value: number;
};

export type ErpPlan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthlyPriceInr: number | null;
  yearlyPriceInr: number | null;
  isCustomPricing: boolean;
  isPopular?: boolean;
  isActive: boolean;
  sortOrder: number;
  supportLevel: string;
  features: ErpPlanFeature[];
  limits: ErpPlanLimit[];
};

export type ErpWebsiteSection = {
  id: string;
  key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  imageUrl: string | null;
  sortOrder: number;
  contentJson: unknown;
  isVisible: boolean;
};

export type ErpWebsitePage = {
  id: string;
  slug: string;
  title: string;
  status: string;
  sections: ErpWebsiteSection[];
  seo?: {
    title: string | null;
    description: string | null;
  } | null;
};

export type ErpCmsService = {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  featuresJson: unknown;
  ctaLabel: string | null;
  ctaHref: string | null;
  sortOrder: number;
};

export type ErpBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  authorName: string | null;
  featuredImageUrl: string | null;
  tagsJson: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  category: { id: string; slug: string; name: string } | null;
};

export type ErpFaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  pageSlug: string;
};

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function sectionByKey(
  sections: ErpWebsiteSection[] | undefined,
  key: string,
): ErpWebsiteSection | undefined {
  return sections?.find((s) => s.key === key);
}
