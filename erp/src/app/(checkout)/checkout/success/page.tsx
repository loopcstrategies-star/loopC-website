"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

/** Same public aliases as getExternalErpUrl (client can only read NEXT_PUBLIC_*). No demo fallback. */
function externalErpUrl(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_ERP_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_EXTERNAL_ERP_URL?.trim() ||
    "";
  return raw ? raw.replace(/\/$/, "") : null;
}

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<string>("pending");
  const [message, setMessage] = useState("Confirming your subscription…");
  const erpUrl = externalErpUrl();

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
          setMessage(`Subscription is ${s}. You can open the ERP product.`);
          return;
        }
        if (attempts < 20) {
          setMessage(`Waiting for activation… (${s ?? "none"})`);
          setTimeout(poll, 1500);
        } else {
          setMessage("Still processing. Check Billing in your account portal.");
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
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {ready && erpUrl ? (
            <a href={erpUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full sm:w-auto">Open ERP</Button>
            </a>
          ) : null}
          <Link href={ready ? "/app" : "/app/billing"}>
            <Button variant={ready ? "secondary" : "primary"} className="w-full sm:w-auto">
              {ready ? "Account portal" : "Open billing"}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
