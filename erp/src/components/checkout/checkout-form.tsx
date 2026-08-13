"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { formatInr } from "@/lib/constants";

type Quote = {
  planName: string;
  billingCycle: string;
  subtotalInr: number;
  discountInr: number;
  taxInr: number;
  taxPercent: number;
  totalInr: number;
  couponCode: string | null;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function CheckoutForm({
  planId,
  planName,
  billingCycle,
  isMockProvider,
}: {
  planId: string;
  planName: string;
  billingCycle: "MONTHLY" | "YEARLY";
  isMockProvider: boolean;
}) {
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);

  async function loadQuote(code?: string) {
    setQuoting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle,
          couponCode: code || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Quote failed");
      setQuote(data.quote);
    } catch (err) {
      setQuote(null);
      setError(err instanceof Error ? err.message : "Quote failed");
    } finally {
      setQuoting(false);
    }
  }

  useEffect(() => {
    void loadQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, billingCycle]);

  async function applyCoupon(e: FormEvent) {
    e.preventDefault();
    await loadQuote(coupon.trim());
  }

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle,
          couponCode: coupon.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      if (isMockProvider || data.provider === "mock") {
        const mock = await fetch("/api/checkout/mock-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providerOrderId: data.order.orderId,
            checkoutSessionId: data.checkout.id,
          }),
        });
        const mockData = await mock.json();
        if (!mock.ok) throw new Error(mockData.error ?? "Mock payment failed");
        router.push("/checkout/success");
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.body.appendChild(script);
      });

      if (!window.Razorpay) throw new Error("Razorpay unavailable");

      const rzp = new window.Razorpay({
        key: data.order.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "LoopC ERP",
        description: `${planName} (${billingCycle.toLowerCase()})`,
        order_id: data.order.orderId,
        handler() {
          router.push("/checkout/success");
        },
        modal: {
          ondismiss() {
            router.push("/checkout/failed");
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardTitle>Checkout</CardTitle>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {planName} · {billingCycle === "YEARLY" ? "Yearly" : "Monthly"}
      </p>

      <form onSubmit={applyCoupon} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="coupon">Coupon</Label>
          <Input
            id="coupon"
            placeholder="Optional code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
        </div>
        <Button type="submit" variant="secondary" className="mt-6" disabled={quoting}>
          Apply
        </Button>
      </form>

      <div className="mt-6 space-y-2 rounded-md bg-[var(--surface-2)] p-4 text-sm">
        {quoting && <p className="text-[var(--muted)]">Calculating…</p>}
        {quote && (
          <>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatInr(quote.subtotalInr)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount{quote.couponCode ? ` (${quote.couponCode})` : ""}</span>
              <span>−{formatInr(quote.discountInr)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({quote.taxPercent}%)</span>
              <span>{formatInr(quote.taxInr)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatInr(quote.totalInr)}</span>
            </div>
          </>
        )}
      </div>

      <FieldError>{error}</FieldError>

      <Button
        className="mt-6 w-full"
        onClick={pay}
        disabled={loading || !quote}
      >
        {loading
          ? "Processing…"
          : isMockProvider
            ? "Confirm payment (dev mock)"
            : "Pay with Razorpay"}
      </Button>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Subscription activates only after payment confirmation on the server.
      </p>
    </Card>
  );
}
