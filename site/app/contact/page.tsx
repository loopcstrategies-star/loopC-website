import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { FadeIn } from "@/components/fade-in";
import { PageBanner } from "@/components/page-banner";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name} — consulting, custom web & mobile, and LoopC ERP.`,
  openGraph: {
    title: `Contact | ${siteConfig.brand}`,
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div>
      <PageBanner
        banner="contact"
        eyebrow="Contact"
        title="Tell us what you need"
        description="Website, mobile app, ERP, or not sure yet — we'll route you to the right conversation."
        priority
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-lg text-slate-600">
              For faster response, try a{" "}
              <Link href="/free-demo" className="font-semibold text-teal-700 hover:underline">
                free demo
              </Link>
              ,{" "}
              <Link href="/free-audit" className="font-semibold text-teal-700 hover:underline">
                free audit
              </Link>
              , or{" "}
              <Link href="/download-brochure" className="font-semibold text-teal-700 hover:underline">
                brochure download
              </Link>
              —they convert better than a generic message.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-sm font-medium text-slate-500">Visit</p>
              <address className="mt-1 not-italic text-sm leading-relaxed text-slate-700">
                {siteConfig.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-5 text-sm font-medium text-slate-500">Email</p>
              <p className="mt-1">
                <a
                  href={`mailto:${siteConfig.salesEmail}`}
                  className="text-base font-semibold text-teal-700 hover:underline"
                >
                  {siteConfig.salesEmail}
                </a>
              </p>
              <p className="mt-5 text-sm font-medium text-slate-500">Phone &amp; WhatsApp</p>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="mt-1 inline-block text-base font-semibold text-slate-900 hover:text-teal-700"
              >
                {siteConfig.phoneDisplay}
              </a>
              <p className="mt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-teal-700 hover:underline"
                >
                  Chat on WhatsApp →
                </a>
              </p>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">{siteConfig.businessHours}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
