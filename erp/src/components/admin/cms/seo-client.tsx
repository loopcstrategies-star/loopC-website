"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

type SeoRow = {
  id: string;
  pageSlug: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  robots: string | null;
};

export function SeoClient({ seo }: { seo: SeoRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    pageSlug: "",
    title: "",
    description: "",
    keywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    robots: "index,follow",
  });
  const [editing, setEditing] = useState<SeoRow | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function upsert(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/cms/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageSlug: form.pageSlug,
        title: form.title || null,
        description: form.description || null,
        keywords: form.keywords || null,
        canonicalUrl: form.canonicalUrl || null,
        ogTitle: form.ogTitle || null,
        ogDescription: form.ogDescription || null,
        ogImageUrl: form.ogImageUrl || null,
        robots: form.robots || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setForm({
      pageSlug: "",
      title: "",
      description: "",
      keywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImageUrl: "",
      robots: "index,follow",
    });
    setMessage("Saved");
    router.refresh();
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/cms/seo/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editing.title,
        description: editing.description,
        keywords: editing.keywords,
        canonicalUrl: editing.canonicalUrl,
        ogTitle: editing.ogTitle,
        ogDescription: editing.ogDescription,
        ogImageUrl: editing.ogImageUrl,
        robots: editing.robots,
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
    await fetch(`/api/admin/cms/seo/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardTitle>Upsert SEO metadata</CardTitle>
        <form onSubmit={upsert} className="mt-4 grid gap-3">
          <div>
            <Label>Page slug</Label>
            <Input
              value={form.pageSlug}
              onChange={(e) => setForm({ ...form, pageSlug: e.target.value })}
              required
              placeholder="home"
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Keywords</Label>
            <Input
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            />
          </div>
          <div>
            <Label>Canonical URL</Label>
            <Input
              value={form.canonicalUrl}
              onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Robots</Label>
            <Input
              value={form.robots}
              onChange={(e) => setForm({ ...form, robots: e.target.value })}
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </Card>

      {editing && (
        <Card className="max-w-2xl">
          <CardTitle>Edit SEO · {editing.pageSlug}</CardTitle>
          <form onSubmit={saveEdit} className="mt-4 grid gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={editing.title ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value || null })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    description: e.target.value || null,
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
        <CardTitle>SEO records</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2">Slug</th>
                <th className="py-2">Title</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seo.map((row) => (
                <tr key={row.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{row.pageSlug}</td>
                  <td className="py-2">{row.title ?? "—"}</td>
                  <td className="py-2 space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(row)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => remove(row.id)}>
                      Delete
                    </Button>
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
