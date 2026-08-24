import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { mapIntentQuery, mapServiceQuery } from "@/lib/contact";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";
import {
  getPublishedEmail,
  getWhatsAppUrl,
  isPublished,
  siteConfig,
  whatsappPrefill,
} from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.contact.title,
  description: pageSeo.contact.description,
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; intent?: string }>;
}) {
  const params = await searchParams;
  const intent = mapIntentQuery(params.intent);
  const email = getPublishedEmail();
  const phone = isPublished(siteConfig.phoneDisplay) ? siteConfig.phoneDisplay : null;
  const phoneTel = isPublished(siteConfig.phoneTel) ? siteConfig.phoneTel : null;
  const whatsapp = getWhatsAppUrl(whatsappPrefill);

  const heroTitle =
    intent === "expert" ? "Talk to an Expert." : "Let's Build Something Great.";

  const heroDescription =
    intent === "expert"
      ? "Whether you're evaluating LoopC ERP or planning custom software, share your context and we'll help you find the right next step."
      : "Share the business problem, the users, and any constraint you already know. We will come back with a clear next step.";

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero
        eyebrow="Contact"
        title={heroTitle}
        description={heroDescription}
        dark
        backgroundImage="/images/page-heroes/contact.jpg"
      />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <Container className="relative grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr] sm:py-20">
          <aside className="h-fit">
            <h2 className="type-h3 font-bold text-[var(--text)]">Let&apos;s Build Something Great.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              Tell us about your project. We respond with a clear next step — not a generic sales
              pitch.
            </p>
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200/70 hover:shadow-md hover:shadow-blue-500/5">
              <h3 className="font-semibold text-[var(--text)]">{siteConfig.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{siteConfig.location.display}</p>
              <div className="mt-5 space-y-2 text-sm">
                {email ? (
                  <p>
                    <a href={`mailto:${email}`} className="text-[var(--primary)] hover:underline">
                      {email}
                    </a>
                  </p>
                ) : null}
                {phone && phoneTel ? (
                  <p>
                    <a href={`tel:${phoneTel}`} className="font-medium text-[var(--text)]">
                      {phone}
                    </a>
                  </p>
                ) : null}
                {whatsapp ? (
                  <p>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] hover:underline"
                    >
                      WhatsApp
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
          <div className="relative rounded-3xl border border-[var(--border)] bg-white/90 p-4 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/5 backdrop-blur sm:p-8">
            <ContactForm
              defaultService={mapServiceQuery(params.service)}
              defaultIntent={intent}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            />
            <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
              We review every enquiry in our team inbox (ERP Admin → Website → Contact).
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
