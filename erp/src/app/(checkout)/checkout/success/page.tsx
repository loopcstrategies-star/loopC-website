"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<string>("pending");
  const [message, setMessage] = useState("Confirming your subscription…");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch("/api/subscription/status");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setMessage(data.error ?? "Could not load subscription");
          if (attempts < 20) setTimeout(poll, 1500);
          return;
        }
        const s = data.status as string | null;
        setStatus(s ?? "none");
        if (s === "ACTIVE" || s === "TRIAL") {
          setMessage(`Subscription is ${s}. You’re ready to go.`);
          return;
        }
        if (attempts < 20) {
          setMessage(`Waiting for activation… (${s ?? "none"})`);
          setTimeout(poll, 1500);
        } else {
          setMessage("Still processing. You can open the app and check Billing.");
        }
      } catch {
        if (!cancelled && attempts < 20) setTimeout(poll, 1500);
      }
    }

    void poll();
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = status === "ACTIVE" || status === "TRIAL";

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardTitle>Payment received</CardTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
        <div className="mt-6">
          <Link href={ready ? "/app" : "/app/billing"}>
            <Button>{ready ? "Go to app" : "Open billing"}</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
