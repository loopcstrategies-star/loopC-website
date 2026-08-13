import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="page-shell marketing-nav">
        <Link href="/" className="brand-mark">
          LoopC ERP
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
            Pricing
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Log in
            </Button>
          </Link>
        </nav>
      </header>

      <main className="page-shell flex flex-1 flex-col justify-center gap-10 py-10 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="fade-up max-w-xl">
            <p className="brand-mark mb-4 text-3xl md:text-4xl">LoopC ERP</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
              Run finance and operations in one calm workspace.
            </h1>
            <p className="fade-up-delay mt-4 max-w-lg text-lg text-[var(--muted)]">
              Subscribe once, unlock accounting, invoicing, inventory, CRM, HR and more —
              with billing that stays out of your way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pricing">
                <Button size="lg">View pricing</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Log in
                </Button>
              </Link>
            </div>
          </div>

          <div className="hero-plane fade-up-delay flex items-end p-8 text-white">
            <div className="relative z-10 max-w-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">Built for teams</p>
              <p className="mt-2 text-2xl font-semibold leading-snug">
                Plan-gated modules, invoices, and subscription control — ready for production.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="page-shell border-t border-[var(--border)] py-6 text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} LoopC Strategies
      </footer>
    </div>
  );
}
