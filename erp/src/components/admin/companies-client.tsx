"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

type CompanyRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string | Date;
  memberships: number;
  planName: string | null;
  subscriptionStatus: string | null;
  planId: string | null;
};

export function CompaniesClient({ companies }: { companies: CompanyRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function act(payload: Record<string, unknown>) {
    setError("");
    const res = await fetch("/api/admin/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Action failed");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Slug</th>
              <th className="py-2">Members</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Company</th>
              <th className="py-2">Subscription</th>
              <th className="py-2">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-t border-[var(--border)]">
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.slug}</td>
                <td className="py-2">{c.memberships}</td>
                <td className="py-2">{c.planName ?? "—"}</td>
                <td className="py-2">{c.status}</td>
                <td className="py-2">{c.subscriptionStatus ?? "—"}</td>
                <td className="py-2">{formatDate(c.createdAt)}</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {c.status !== "suspended" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={pending}
                        onClick={() => act({ action: "suspend", companyId: c.id })}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={pending || !c.planId}
                        onClick={() =>
                          act({
                            action: "activate",
                            companyId: c.id,
                            planId: c.planId,
                          })
                        }
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
