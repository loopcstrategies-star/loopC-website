import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export default function CheckoutFailedPage() {
  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardTitle>Payment not completed</CardTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">
          No charge was finalized. You can try again or pick another plan.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/pricing">
            <Button variant="secondary">Pricing</Button>
          </Link>
          <Link href="/app/billing">
            <Button>Billing</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
