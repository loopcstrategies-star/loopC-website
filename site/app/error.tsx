"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error.digest ?? error.name);
  }, [error]);

  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="type-label text-teal-700">Something went wrong</p>
      <h1 className="type-h1 mt-4 font-bold text-slate-950">This view failed to load.</h1>
      <p className="mt-4 text-slate-600">
        You can try again, or go back to the homepage. The rest of the site is still available.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex rounded-full bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800"
        >
          Back Home
        </Link>
      </div>
    </section>
  );
}
