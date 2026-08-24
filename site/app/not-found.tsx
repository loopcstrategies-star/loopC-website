import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Page not found",
  description: `The page you requested is not available on the ${siteConfig.name} website.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="on-dark relative overflow-hidden bg-[#050b16] px-4 py-24 sm:px-6 sm:py-32">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute right-10 top-10 h-40 w-64 rounded-2xl border border-white/10 bg-white/5 p-4 opacity-60">
        <div className="h-2 w-24 rounded bg-teal-400/40" />
        <div className="mt-3 h-16 rounded bg-white/5" />
        <div className="mt-2 h-2 w-full rounded bg-white/10" />
      </div>
      <div className="relative mx-auto max-w-xl text-center">
        <p className="type-label text-blue-300">404</p>
        <h1 className="type-h1 mt-4 font-bold text-white">Looks like this page went offline.</h1>
        <p className="mt-4 text-slate-300">
          The interface you asked for is not on this site. {siteConfig.brand} is still here —
          head home or start a project conversation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to LoopC home
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
          >
            Contact LoopC Business Strategies
          </Link>
        </div>
      </div>
    </section>
  );
}
