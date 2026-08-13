import { Suspense } from "react";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="page-shell marketing-nav">
        <Link href="/" className="brand-mark">
          LoopC ERP
        </Link>
      </header>
      <main className="page-shell flex flex-1 items-center justify-center py-12">
        <Suspense fallback={<div className="text-[var(--muted)]">Loading…</div>}>
          <SignupForm />
        </Suspense>
      </main>
    </div>
  );
}
