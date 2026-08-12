import { FadeIn } from "@/components/motion/fade-in";
import { Container, SectionLabel } from "@/components/ui/container";
import { productStorySteps } from "@/lib/process";

export function ProductStory() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionLabel>03 — Product story</SectionLabel>
          <h2 className="type-h2 mt-3 max-w-3xl font-bold text-slate-950">
            Ideas are easy. Building them right is the difference.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            LoopC helps businesses move from a conversation to a product people can use —
            without skipping the unglamorous steps in the middle.
          </p>
        </FadeIn>

        <div className="mt-12 overflow-x-auto pb-2">
          <ol className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-4 lg:grid-cols-8">
            {productStorySteps.map((step, index) => (
              <li
                key={step}
                className="flex w-36 flex-col rounded-2xl border border-slate-200 bg-[#f4f6fa] p-4 sm:w-auto"
              >
                <span className="text-[11px] font-semibold text-teal-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-2 text-sm font-semibold text-slate-900">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
