import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { type ErpFaqItem, erpFetch } from "@/lib/erp-api";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Answers about LoopC ERP, plans, and custom software services.",
  path: "/faq",
});

const fallbackFaqs: ErpFaqItem[] = [
  {
    id: "1",
    question: "What is LoopC ERP?",
    answer:
      "A multi-tenant SaaS ERP with plan-gated modules for accounting, inventory, CRM, HR and more.",
    sortOrder: 1,
    pageSlug: "faq",
  },
  {
    id: "2",
    question: "Can I change plans later?",
    answer:
      "Yes. Upgrade immediately (prorated) or schedule a downgrade for the next billing cycle.",
    sortOrder: 2,
    pageSlug: "faq",
  },
  {
    id: "3",
    question: "Do you build custom software too?",
    answer:
      "Yes. LoopC also builds websites, mobile apps, SaaS products and automation systems.",
    sortOrder: 3,
    pageSlug: "faq",
  },
];

type Payload = { faqs: ErpFaqItem[] };

export default async function FaqPage() {
  const data = await erpFetch<Payload>("/api/public/faqs?pageSlug=faq");
  const faqs = data?.faqs?.length ? data.faqs : fallbackFaqs;

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <PageHero
        eyebrow="FAQ"
        title="Questions we hear often."
        description="ERP subscriptions, plan changes, and how LoopC works with custom software projects."
        dark
      />
      <Container className="max-w-3xl space-y-4 py-16 sm:py-20">
        {faqs.map((item) => (
          <details
            key={item.id}
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-semibold text-slate-950 marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-[var(--primary)] transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-slate-600">{item.answer}</p>
          </details>
        ))}
      </Container>
    </div>
  );
}
