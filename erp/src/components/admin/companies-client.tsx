"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

type CompanyRow = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  createdAt: string | Date;
  memberships: number;
  planName: string | null;
  subscriptionStatus: string | null;
  planId: string | null;
  externalErpCustomerId: string | null;
};

export function CompaniesClient({ companies }: { companies: CompanyRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    email: "",
    phone: "",
    address: "",
    externalErpCustomerId: "",
  });

  const filtered = companies.filter((c) => {
    if (subFilter !== "all" && c.subscriptionStatus !== subFilter) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.slug.toLowerCase().includes(search.toLowerCase()) &&
      !(c.email ?? "").toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

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
    setEditingId(null);
    startTransition(() => router.refresh());
  }

  function startEdit(c: CompanyRow) {
    setEditingId(c.id);
    setDraft({
      email: c.email ?? "",
      phone: c.phone ?? "",
      address: c.address ?? "",
      externalErpCustomerId: c.externalErpCustomerId ?? "",
    });
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search customers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
          value={subFilter}
          onChange={(e) => setSubFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="PAST_DUE">Past due</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <span className="self-center text-sm text-[var(--muted)]">{filtered.length} customers</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Contact</th>
              <th className="py-2">ERP ID</th>
              <th className="py-2">Members</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Company</th>
              <th className="py-2">Subscription</th>
              <th className="py-2">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-[var(--border)] align-top">
                <td className="py-2">
                  <div>{c.name}</div>
                  <div className="text-xs text-[var(--muted)]">{c.slug}</div>
                </td>
                <td className="py-2">
                  {editingId === c.id ? (
                    <div className="flex min-w-[220px] flex-col gap-1.5">
                      <Input
                        placeholder="Email"
                        value={draft.email}
                        onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      />
                      <Input
                        placeholder="Phone"
                        value={draft.phone}
                        onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                      />
                      <Input
                        placeholder="Address"
                        value={draft.address}
                        onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                      />
                      <Input
                        placeholder="External ERP customer ID"
                        value={draft.externalErpCustomerId}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, externalErpCustomerId: e.target.value }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-0.5 text-xs">
                      <div>{c.email || "—"}</div>
                      <div className="text-[var(--muted)]">{c.phone || "—"}</div>
                      <div className="text-[var(--muted)]">{c.address || "—"}</div>
                    </div>
                  )}
                </td>
                <td className="py-2 font-mono text-xs">
                  {editingId === c.id ? "…" : (c.externalErpCustomerId ?? "—")}
                </td>
                <td className="py-2">{c.memberships}</td>
                <td className="py-2">{c.planName ?? "—"}</td>
                <td className="py-2">{c.status}</td>
                <td className="py-2">{c.subscriptionStatus ?? "—"}</td>
                <td className="py-2">{formatDate(c.createdAt)}</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {editingId === c.id ? (
                      <>
                        <Button
                          type="button"
                          disabled={pending}
                          onClick={() =>
                            act({
                              action: "update",
                              companyId: c.id,
                              email: draft.email.trim() || null,
                              phone: draft.phone.trim() || null,
                              address: draft.address.trim() || null,
                              externalErpCustomerId: draft.externalErpCustomerId.trim() || null,
                            })
                          }
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={pending}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={pending}
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </Button>
                    )}
                    {c.status !== "suspended" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={pending || editingId === c.id}
                        onClick={() => act({ action: "suspend", companyId: c.id })}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={pending || !c.planId || editingId === c.id}
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
