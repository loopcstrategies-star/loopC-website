"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: string;
  internalNotes: string | null;
  createdAt: string | Date;
};

export function ContactsClient({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Contact | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/cms/contacts/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: editing.status,
        internalNotes: editing.internalNotes,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setEditing(null);
    setMessage("Updated");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {editing && (
        <Card className="max-w-xl">
          <CardTitle>Update submission</CardTitle>
          <form onSubmit={save} className="mt-4 space-y-3">
            <p className="text-sm">
              <strong>{editing.name}</strong> · {editing.email}
            </p>
            <div>
              <Label>Status</Label>
              <Select
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="in_progress">In progress</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam</option>
              </Select>
            </div>
            <div>
              <Label>Internal notes</Label>
              <Textarea
                rows={3}
                value={editing.internalNotes ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    internalNotes: e.target.value || null,
                  })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <CardTitle>Contact submissions</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2">When</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Service</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-t border-[var(--border)] align-top">
                  <td className="py-2 whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{c.email}</td>
                  <td className="py-2">{c.service ?? "—"}</td>
                  <td className="py-2">{c.status}</td>
                  <td className="py-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(c)}>
                      Update
                    </Button>
                    <p className="mt-2 max-w-xs text-xs text-[var(--muted)]">
                      {c.message.slice(0, 120)}
                      {c.message.length > 120 ? "…" : ""}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No submissions yet.</p>
          )}
        </div>
      </Card>
      {message && <p className="text-sm text-[var(--muted)]">{message}</p>}
    </div>
  );
}
