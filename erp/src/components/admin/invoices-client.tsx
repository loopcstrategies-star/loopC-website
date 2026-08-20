"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

type Invoice = {
  id: string;
  number: string;
  companyId: string;
  companyName: string;
  status: string;
  totalInr: number;
  totalLabel: string;
  currency: string;
  paidAt: string | null;
  createdAt: string;
  subscriptionId: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  PAID: "bg-green-100 text-green-800",
  VOID: "bg-slate-100 text-slate-600",
  UNCOLLECTIBLE: "bg-red-100 text-red-700",
};

export function InvoicesClient({ invoices: initial }: { invoices: Invoice[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = initial.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (
      search &&
      !inv.number.toLowerCase().includes(search.toLowerCase()) &&
      !inv.companyName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search invoice # or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="PAID">Paid</option>
          <option value="VOID">Void</option>
          <option value="UNCOLLECTIBLE">Uncollectible</option>
        </select>
        <span className="self-center text-sm text-[var(--muted)]">{filtered.length} invoices</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
            <tr>
              {["Invoice #", "Customer", "Amount", "Status", "Paid at", "Created", ""].map((h) => (
                <th key={h || "actions"} className="px-4 py-3 text-left font-semibold text-[var(--muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[var(--muted)]">
                  No invoices found.
                </td>
              </tr>
            )}
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-[var(--surface-2)]">
                <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                <td className="px-4 py-3 font-medium">{inv.companyName}</td>
                <td className="px-4 py-3 font-semibold text-[var(--ink)]">{inv.totalLabel}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      STATUS_COLORS[inv.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/api/admin/invoices/${inv.id}/pdf`}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    Download PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
