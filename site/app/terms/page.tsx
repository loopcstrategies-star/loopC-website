import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getPublishedEmail, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description: `Terms for using the ${siteConfig.name} website and for starting a software engagement.`,
  path: "/terms",
});

export default function TermsPage() {
  const email = getPublishedEmail();

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        description={`Last updated ${siteConfig.legal.lastUpdatedDisplay}. These terms cover this website. Project work is governed by a written agreement.`}
      />
      <Container className="max-w-3xl space-y-8 py-16 text-slate-600 sm:py-20">
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">The website</h2>
          <p className="mt-3">
            This site is published by {siteConfig.legalName}, {siteConfig.location.display}.
            Content is for information about our software services. It is not a binding offer,
            quote, or professional advice.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Enquiries</h2>
          <p className="mt-3">
            Sending the contact form is a request to talk. It does not create a contract. We may
            decline work that is a poor fit.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Project work</h2>
          <p className="mt-3">
            Design and development engagements start only when both sides sign a statement of
            work or equivalent agreement covering scope, fees, intellectual property, and
            confidentiality. Until then, estimates are indicative.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Intellectual property</h2>
          <p className="mt-3">
            The LoopC name, this website, and our product names remain ours. Client project IP
            is handled in the project agreement — we do not claim your business data.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Acceptable use</h2>
          <p className="mt-3">
            Do not misuse the site: no scraping that harms availability, no injecting malicious
            content into forms, and no impersonation of LoopC.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Liability</h2>
          <p className="mt-3">
            The website is provided as-is. We are not liable for decisions made solely on public
            marketing copy. Project liability is limited as stated in the signed agreement.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Governing law</h2>
          <p className="mt-3">
            These website terms are governed by the laws of {siteConfig.legal.governingRegion}.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Contact</h2>
          <p className="mt-3">
            Questions: the{" "}
            <Link href="/contact" className="font-medium text-teal-700 hover:underline">
              contact form
            </Link>
            {email ? (
              <>
                {" "}
                or {email}
              </>
            ) : null}
            .
          </p>
        </section>
      </Container>
    </div>
  );
}
