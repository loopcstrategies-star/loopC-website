import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { mapIntentQuery, mapServiceQuery } from "@/lib/contact";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import {
  getPublishedEmail,
  getWhatsAppUrl,
  isPublished,
  siteConfig,
  whatsappPrefill,
} from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Contact LoopC | Talk to an expert",
  description:
    "Tell us what you're trying to build — LoopC ERP, custom software, web apps, mobile apps or dashboards.",
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
    intent === "expert"
      ? "Talk to an expert."
      : intent === "project"
        ? "Tell us what you're trying to build."
        : "Tell us what you're trying to build.";

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
      <PageHero eyebrow="Contact" title={heroTitle} description={heroDescription} dark />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] sm:py-20">
        <ContactForm
          defaultService={mapServiceQuery(params.service)}
          defaultIntent={intent}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        />
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-950">{siteConfig.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{siteConfig.location.display}</p>
          <div className="mt-5 space-y-2 text-sm">
            {email ? (
              <p>
                <a href={`mailto:${email}`} className="text-teal-700 hover:underline">
                  {email}
                </a>
              </p>
            ) : null}
            {phone && phoneTel ? (
              <p>
                <a href={`tel:${phoneTel}`} className="font-medium text-slate-900">
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
                  className="text-teal-700 hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            ) : null}
            {!email && !phone && !whatsapp ? (
              <p className="text-slate-600">
                Use the form on this page. It is the fastest way to reach the team.
              </p>
            ) : null}
          </div>
        </aside>
      </Container>
    </div>
  );
}
