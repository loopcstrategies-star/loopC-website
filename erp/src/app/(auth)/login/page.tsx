import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="page-shell marketing-nav">
        <Link href="/" className="brand-mark">
          LoopC ERP
        </Link>
      </header>
      <main className="page-shell flex flex-1 items-center justify-center py-12">
        <Suspense fallback={<div className="text-[var(--muted)]">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
