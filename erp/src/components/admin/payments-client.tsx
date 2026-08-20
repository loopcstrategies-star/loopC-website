"use client";

import { useMemo, useState } from "react";

export type PaymentRow = {
  id: string;
  companyName: string;
  planName: string | null;
  amountLabel: string;
  status: string;
  provider: string;
  createdAt: string;
};

export function PaymentsClient({ payments }: { payments: PaymentRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (
        search &&
        !p.companyName.toLowerCase().includes(search.toLowerCase()) &&
        !(p.planName ?? "").toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (fromDate) {
        const from = new Date(fromDate);
        if (new Date(p.createdAt) < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (new Date(p.createdAt) > to) return false;
      }
      return true;
    });
  }, [payments, search, statusFilter, fromDate, toDate]);

  const statusClass: Record<string, string> = {
    SUCCEEDED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-700",
    PENDING: "bg-amber-100 text-amber-800",
    REFUNDED: "bg-slate-100 text-slate-600",
    PARTIALLY_REFUNDED: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          className="max-w-xs rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
          placeholder="Search company or plan…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="SUCCEEDED">Succeeded</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
          <option value="REFUNDED">Refunded</option>
          <option value="PARTIALLY_REFUNDED">Partially refunded</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          From
          <input
            type="date"
            className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--ink)]"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          To
          <input
            type="date"
            className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--ink)]"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <span className="self-center text-sm text-[var(--muted)]">{filtered.length} payments</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--muted)]">
                  No payments found.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--surface-2)]">
                <td className="px-4 py-3 font-medium">{p.companyName}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{p.planName ?? "—"}</td>
                <td className="px-4 py-3 font-semibold">{p.amountLabel}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      statusClass[p.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">{p.provider}</td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {new Date(p.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
