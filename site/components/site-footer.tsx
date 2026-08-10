import Link from "next/link";
import { Logo } from "@/components/logo";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

const serviceLinks = [
  { href: "/services#web", label: "Web Development" },
  { href: "/services#mobile", label: "Mobile Development" },
  { href: "/services#erp", label: "ERP Solutions" },
  { href: "/services#custom", label: "Custom Software" },
  { href: "/services#design", label: "UI/UX" },
  { href: "/services#testing", label: "Testing & QA" },
] as const;

const erpLinks = [
  { href: "/erp", label: "Overview" },
  { href: "/features", label: "Features" },
  { href: "/industries", label: "Industries" },
  { href: "/erp/pricing", label: "Plans" },
  { href: "/free-demo", label: "Book a Demo" },
] as const;

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/work", label: "Case Studies" },
  { href: "/#faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
] as const;

function SocialIconLinkedIn() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialIconX() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialIconWhatsApp() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SocialIconYouTube() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-teal-400/40 hover:bg-teal-500/15 hover:text-white"
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo variant="footer" />
            <p className="mt-4 text-sm font-semibold leading-snug text-teal-100/90">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              We build digital systems that help businesses operate, connect and grow.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <SocialButton href={siteConfig.social.linkedIn} label="LoopC on LinkedIn">
                <SocialIconLinkedIn />
              </SocialButton>
              <SocialButton href={siteConfig.social.x} label="LoopC on X">
                <SocialIconX />
              </SocialButton>
              <SocialButton href={getWhatsAppUrl()} label="Contact LoopC on WhatsApp">
                <SocialIconWhatsApp />
              </SocialButton>
              <SocialButton href={siteConfig.social.youTube} label="LoopC on YouTube">
                <SocialIconYouTube />
              </SocialButton>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 transition hover:text-teal-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Services</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {serviceLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 transition hover:text-teal-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">ERP</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {erpLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 transition hover:text-teal-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Resources</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {resourceLinks.map(({ href, label }) => (
                <li key={href + label}>
                  <Link href={href} className="text-slate-400 transition hover:text-teal-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Contact</p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-slate-400">
              {siteConfig.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <a href={`mailto:${siteConfig.salesEmail}`} className="text-teal-400 hover:underline">
                  {siteConfig.salesEmail}
                </a>
              </p>
              <p>
                <a href={`tel:${siteConfig.phoneTel}`} className="font-medium text-white hover:text-teal-300">
                  {siteConfig.phoneDisplay}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-slate-400">
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="text-slate-400 transition hover:text-teal-300">
              Privacy policy
            </Link>
            <Link href="/terms" className="text-slate-400 transition hover:text-teal-300">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
