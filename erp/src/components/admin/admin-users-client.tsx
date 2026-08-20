"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  name: string | null;
  email: string;
  isSuperAdmin: boolean;
  createdAt: string;
  companyName: string | null;
};

export function AdminUsersClient({ users }: { users: Row[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleAdmin(user: Row) {
    setBusyId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuperAdmin: !user.isSuperAdmin }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2 font-medium">User</th>
              <th className="px-3 py-2 font-medium">Company</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--border)]">
                <td className="px-3 py-2">
                  <p className="font-medium text-[var(--ink)]">{u.name ?? "—"}</p>
                  <p className="text-[var(--muted)]">{u.email}</p>
                </td>
                <td className="px-3 py-2 text-[var(--muted)]">{u.companyName ?? "—"}</td>
                <td className="px-3 py-2">
                  {u.isSuperAdmin ? (
                    <span className="font-semibold text-[var(--accent)]">Super admin</span>
                  ) : (
                    <span className="text-[var(--muted)]">User</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={busyId === u.id}
                    onClick={() => void toggleAdmin(u)}
                  >
                    {u.isSuperAdmin ? "Revoke admin" : "Make admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
