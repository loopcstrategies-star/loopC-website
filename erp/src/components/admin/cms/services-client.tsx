"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

type Service = {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function ServicesClient({ services }: { services: Service[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/cms/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        summary: summary || null,
        description: description || null,
        sortOrder: services.length + 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setName("");
    setSummary("");
    setDescription("");
    setMessage("Created");
    router.refresh();
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/cms/services/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editing.name,
        summary: editing.summary,
        description: editing.description,
        isActive: editing.isActive,
        sortOrder: editing.sortOrder,
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

  async function remove(id: string) {
    await fetch(`/api/admin/cms/services/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function toggle(s: Service) {
    await fetch(`/api/admin/cms/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Create service</CardTitle>
        <form onSubmit={create} className="mt-4 grid gap-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Summary</Label>
            <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </Card>

      {editing && (
        <Card>
          <CardTitle>Edit service</CardTitle>
          <form onSubmit={saveEdit} className="mt-4 grid gap-3">
            <div>
              <Label>Name</Label>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Summary</Label>
              <Input
                value={editing.summary ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, summary: e.target.value || null })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value || null })
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
        <CardTitle>Services</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">{s.slug}</td>
                  <td className="py-2">{s.isActive ? "Yes" : "No"}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(s)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => toggle(s)}>
                      {s.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => remove(s.id)}>
                      Delete
                    </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {message && <p className="text-sm text-[var(--muted)]">{message}</p>}
    </div>
  );
}
