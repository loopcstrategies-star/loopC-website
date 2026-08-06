import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { pricingTiers } from "@/lib/pricing";

type ErpPricingTableProps = {
  /** Show all four tiers including Custom Build */
  showCustomBuild?: boolean;
};

export function ErpPricingTable({ showCustomBuild = true }: ErpPricingTableProps) {
  const tiers = showCustomBuild
    ? pricingTiers
    : pricingTiers.filter((t) => t.id !== "custom-build");

  return (
    <div
      className={`grid gap-8 ${tiers.length === 4 ? "lg:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      {tiers.map((tier, i) => (
        <FadeIn key={tier.id} delay={0.08 * i}>
          <article
            className={`glass-panel flex h-full flex-col rounded-2xl p-8 ${
              tier.featured
                ? "border-2 border-teal-400/60 shadow-xl shadow-teal-600/10"
                : "border border-slate-200/80"
            }`}
          >
            {tier.featured ? (
              <span className="mb-4 inline-flex w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
                Most popular
              </span>
            ) : null}
            <h2 className="text-2xl font-bold text-slate-900">{tier.name}</h2>
            <p className="mt-2 text-sm font-medium text-teal-700">{tier.tagline}</p>
            <p className="mt-4 text-sm text-slate-600">For: {tier.idealFor}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
              {tier.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-teal-600" aria-hidden>
                    ✓
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-semibold text-slate-500">{tier.priceNote}</p>
            <Link
              href={tier.id === "custom-build" ? "/contact" : "/free-demo"}
              className="interactive-shine mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-md"
            >
              {tier.id === "custom-build" ? "Talk to us" : "Book demo"}
            </Link>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
