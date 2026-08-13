"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  companyName: string | null;
  rating: number | null;
  isActive: boolean;
  sortOrder: number;
};

export function TestimonialsClient({ items }: { items: Testimonial[] }) {
  const router = useRouter();
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/cms/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quote,
        authorName,
        authorRole: authorRole || null,
        companyName: companyName || null,
        sortOrder: items.length + 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setQuote("");
    setAuthorName("");
    setAuthorRole("");
    setCompanyName("");
    setMessage("Created");
    router.refresh();
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/cms/testimonials/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quote: editing.quote,
        authorName: editing.authorName,
        authorRole: editing.authorRole,
        companyName: editing.companyName,
        rating: editing.rating,
        isActive: editing.isActive,
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

  async function toggle(t: Testimonial) {
    await fetch(`/api/admin/cms/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/cms/testimonials/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Create testimonial</CardTitle>
        <form onSubmit={create} className="mt-4 grid gap-3">
          <div>
            <Label>Quote</Label>
            <Textarea rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} required />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Author</Label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
          </div>
          <Button type="submit">Create</Button>
        </form>
      </Card>

      {editing && (
        <Card>
          <CardTitle>Edit testimonial</CardTitle>
          <form onSubmit={saveEdit} className="mt-4 grid gap-3">
            <div>
              <Label>Quote</Label>
              <Textarea
                rows={3}
                value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
              />
            </div>
            <div>
              <Label>Author</Label>
              <Input
                value={editing.authorName}
                onChange={(e) => setEditing({ ...editing, authorName: e.target.value })}
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
        <CardTitle>Testimonials</CardTitle>
        <div className="mt-4 space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="rounded-md border border-[var(--border)] p-3 text-sm"
            >
              <p>“{t.quote}”</p>
              <p className="mt-1 text-[var(--muted)]">
                {t.authorName}
                {t.authorRole ? `, ${t.authorRole}` : ""}
                {t.companyName ? ` · ${t.companyName}` : ""}
                {" · "}
                {t.isActive ? "Active" : "Inactive"}
              </p>
              <div className="mt-2 space-x-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(t)}>
                  Edit
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toggle(t)}>
                  {t.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(t.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {message && <p className="text-sm text-[var(--muted)]">{message}</p>}
    </div>
  );
}
