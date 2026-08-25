import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.cookies.title,
  description: pageSeo.cookies.description,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Cookie Policy", path: "/cookies" },
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Cookie policy"
        description={`Last updated ${siteConfig.legal.lastUpdatedDisplay}. How ${siteConfig.legalName} uses cookies and similar technologies on this website.`}
      />
      <Container className="max-w-3xl space-y-8 py-16 text-slate-600 sm:py-20">
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">What are cookies?</h2>
          <p className="mt-3">
            Cookies are small text files stored on your device when you visit a website. They help
            the site work, remember preferences, or understand how pages are used.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">What we use</h2>
          <p className="mt-3">
            This marketing site primarily relies on essential cookies and technical logs required
            for hosting, security and form protection (for example rate limiting or bot checks when
            configured). We do not use advertising trackers on this website by default.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Analytics</h2>
          <p className="mt-3">
            If we enable privacy-respecting analytics, those tools may set cookies or use similar
            storage. We will update this page when that happens and provide a choice where required
            by law.
          </p>
        </section>
        <section>
          <h2 className="type-h3 font-semibold text-slate-950">Managing cookies</h2>
          <p className="mt-3">
            You can control cookies through your browser settings. Blocking essential cookies may
            affect contact forms or security checks. For more on how we handle personal data, see
            our{" "}
            <Link href="/privacy" className="font-semibold text-[var(--primary)] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </Container>
    </div>
  );
}
