import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { PremiumCard } from "@/components/ui/split-card";
import { services } from "@/lib/services";

export function ServicesSection({ services: cmsServices }: { services?: unknown }) {
  void cmsServices;
  const featured = services.slice(0, 6);

  return (
    <section className="section-light py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Services"
            title="Software services for growing businesses."
            description="Web, mobile, dashboards, automation and custom systems — one team from discovery through support."
          />
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, index) => (
            <FadeIn key={service.slug} delay={index * 0.04}>
              <PremiumCard
                title={service.title}
                description={service.summary}
                href={service.href}
                linkLabel={`Explore ${service.shortTitle}`}
              />
            </FadeIn>
          ))}
        </div>

        <p className="mt-10 text-center">
          <Link href="/services" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            View full services catalogue →
          </Link>
        </p>
      </Container>
    </section>
  );
}
