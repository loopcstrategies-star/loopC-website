import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getPublishedEmail, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description: `How ${siteConfig.name} handles information submitted through this website.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const email = getPublishedEmail();

  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        description={`Last updated ${siteConfig.legal.lastUpdatedDisplay}. This policy describes how ${siteConfig.legalName} handles information collected through this website.`}
      />
      <Container className="max-w-3xl space-y-8 py-16 text-slate-600 sm:py-20">
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Who we are</h2>
          <p className="mt-3">
            {siteConfig.legalName} (“LoopC”, “we”) is a software development company based in{" "}
            {siteConfig.location.display}. This website is our public presence and enquiry
            channel.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">What we collect</h2>
          <p className="mt-3">
            If you use the contact form, we receive the details you submit: name, company, email,
            phone, service interest, optional budget range, and project description. We do not
            ask for payment card data on this website.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Why we use it</h2>
          <p className="mt-3">
            We use enquiry information to respond to you, to understand the project, and — if we
            work together — to deliver the engagement. We do not sell personal information.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Website analytics and cookies</h2>
          <p className="mt-3">
            This site may use privacy-respecting analytics or hosting logs that record technical
            data such as browser type and pages visited. If we add cookies that are not strictly
            necessary, we will update this page and provide a choice where required.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Third-party services</h2>
          <p className="mt-3">
            Form delivery may use a server-side email or form provider configured by LoopC.
            Hosting and fonts may be provided by our infrastructure and Next.js font pipeline.
            Those providers process data only to deliver their service.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Retention</h2>
          <p className="mt-3">{siteConfig.legal.enquiryRetention}</p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Your rights</h2>
          <p className="mt-3">
            You may ask what enquiry information we hold about you, ask us to correct it, or ask
            us to delete it where we do not need it to complete a conversation or contract.
            Applicable Indian law, including the Digital Personal Data Protection Act where it
            applies, guides how we handle these requests.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">How to reach us</h2>
          <p className="mt-3">
            Use the{" "}
            <Link href="/contact" className="font-medium text-[var(--primary)] hover:underline">
              contact form
            </Link>
            {email ? (
              <>
                {" "}
                or email{" "}
                <a href={`mailto:${email}`} className="font-medium text-[var(--primary)] hover:underline">
                  {email}
                </a>
              </>
            ) : null}
            . Postal location: {siteConfig.location.display}.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            This page is written for a software studio website. It is not a substitute for
            counsel. Configurable fields live in site configuration so LoopC can update facts
            without inventing legal claims.
          </p>
        </section>
      </Container>
    </div>
  );
}
