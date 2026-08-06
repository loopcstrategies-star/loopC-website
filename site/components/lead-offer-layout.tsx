import Link from "next/link";
import { ContactForm, type FormIntent } from "@/components/contact-form";
import { FadeIn } from "@/components/fade-in";
import type { LeadOffer } from "@/lib/lead-offers";
import { getWhatsAppUrl } from "@/lib/site-config";

type LeadOfferLayoutProps = {
  offer: LeadOffer;
};

export function LeadOfferLayout({ offer }: LeadOfferLayoutProps) {
  const intent = offer.intent as FormIntent;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-50" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              {offer.title}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
              {offer.headline}
            </h1>
            <p className="mt-5 text-lg text-slate-600">{offer.description}</p>
            <ul className="mt-8 space-y-3 text-sm text-slate-600">
              {offer.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-teal-600" aria-hidden>
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-500">
              Prefer WhatsApp?{" "}
              <a
                href={getWhatsAppUrl()}
                className="font-semibold text-teal-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us
              </a>
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <ContactForm intent={intent} />
            </div>
          </FadeIn>
        </div>
        <p className="mt-12 text-center text-sm text-slate-500">
          <Link href="/erp" className="font-semibold text-teal-700 hover:underline">
            LoopC ERP
          </Link>
          {" · "}
          <Link href="/services" className="font-semibold text-teal-700 hover:underline">
            Services
          </Link>
          {" · "}
          <Link href="/work" className="font-semibold text-teal-700 hover:underline">
            Our work
          </Link>
        </p>
      </div>
    </div>
  );
}
