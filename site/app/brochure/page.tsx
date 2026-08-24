import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PrintButton } from "@/components/print-button";
import { Container } from "@/components/ui/container";
import { footerServiceLinks } from "@/lib/services";
import { getBreadcrumbSchema, pageMetadata, pageSeo } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: pageSeo.brochure.title,
  description: pageSeo.brochure.description,
  path: "/brochure",
});

export default function BrochurePage() {
  return (
    <div className="bg-white">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Brochure", path: "/brochure" },
        ])}
      />
      <div className="border-b border-slate-200 bg-slate-50 print:hidden">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
          <p className="text-sm text-slate-600">
            This is a printable company overview — not a PDF file download.
          </p>
          <PrintButton>Print / Save as PDF</PrintButton>
        </Container>
      </div>
      <Container className="max-w-3xl py-12 sm:py-16">
        <p className="type-label text-[var(--primary)]">{siteConfig.location.short}</p>
        <h1 className="type-h1 mt-3 font-bold text-slate-950">{siteConfig.name}</h1>
        <p className="mt-4 text-lg text-slate-700">{siteConfig.tagline}</p>
        <p className="mt-4 text-slate-600">{siteConfig.description}</p>

        <h2 className="type-h3 mt-10 font-semibold text-slate-950">What we build</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {footerServiceLinks.map((item) => (
            <li key={item.href} className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
              {item.label}
            </li>
          ))}
        </ul>

        <h2 className="type-h3 mt-10 font-semibold text-slate-950">How we work</h2>
        <p className="mt-3 text-slate-600">
          Strategy, UX, UI, development, testing, deployment and support — one team from idea to
          launch.
        </p>

        <h2 className="type-h3 mt-10 font-semibold text-slate-950">Start a conversation</h2>
        <p className="mt-3 text-slate-600">
          Visit the website contact page to describe your project. {siteConfig.location.display}.
        </p>
        <p className="mt-6 print:hidden">
          <Link href="/contact" className="font-semibold text-[var(--primary)] hover:underline">
            Start a Project
          </Link>
        </p>
      </Container>
    </div>
  );
}
