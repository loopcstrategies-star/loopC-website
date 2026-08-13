"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select } from "@/components/ui/input";

export function InviteMemberForm({
  atLimit,
  userLimit,
  memberCount,
}: {
  atLimit: boolean;
  userLimit: number | null;
  memberCount: number;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState("employee");
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTempPassword(null);

    const res = await fetch("/api/app/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, roleKey }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not add member");
      return;
    }

    if (data.temporaryPassword) {
      setTempPassword(data.temporaryPassword);
    }
    setName("");
    setEmail("");
    router.refresh();
  }

  if (atLimit) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4 text-sm">
        <p className="font-medium text-amber-900">
          Seat limit reached ({memberCount}
          {userLimit != null ? ` / ${userLimit}` : ""})
        </p>
        <p className="mt-1 text-amber-800/80">
          Upgrade your plan to invite more teammates.
        </p>
        <Link href="/pricing" className="mt-3 inline-block text-[var(--accent)] hover:underline">
          Upgrade plan
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor="invite-name">Name</Label>
        <Input
          id="invite-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="invite-email">Email</Label>
        <Input
          id="invite-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="invite-role">Role</Label>
        <Select
          id="invite-role"
          value={roleKey}
          onChange={(e) => setRoleKey(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="accountant">Accountant</option>
          <option value="manager">Manager</option>
          <option value="company_admin">Company Admin</option>
        </Select>
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding…" : "Add member"}
        </Button>
      </div>
      <div className="sm:col-span-2">
        <FieldError>{error}</FieldError>
        {tempPassword && (
          <p className="mt-2 rounded-md bg-[var(--surface-2)] p-3 text-sm">
            Temporary password (share securely):{" "}
            <code className="font-semibold">{tempPassword}</code>
          </p>
        )}
      </div>
    </form>
  );
}
