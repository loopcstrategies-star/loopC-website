"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea, Select } from "@/components/ui/input";

type Site = {
  siteName: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  footerText: string | null;
};

type Section = {
  id: string;
  key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  sortOrder: number;
  isVisible: boolean;
};

type Page = {
  id: string;
  slug: string;
  title: string;
  status: string;
  sections: Section[];
};

export function WebsiteHomeClient({
  site,
  home,
}: {
  site: Site;
  home: Page | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState(site);
  const [message, setMessage] = useState<string | null>(null);
  const [sections, setSections] = useState(home?.sections ?? []);
  const [pageStatus, setPageStatus] = useState(home?.status ?? "draft");

  async function saveSite(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/cms/site", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed to save site");
      return;
    }
    setMessage("Site settings saved");
    router.refresh();
  }

  async function saveHome() {
    if (!home) return;
    setMessage(null);
    const res = await fetch(`/api/admin/cms/pages/${home.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: pageStatus,
        sections: sections.map((s, i) => ({
          ...(s.id ? { id: s.id } : {}),
          key: s.key,
          title: s.title,
          subtitle: s.subtitle,
          body: s.body,
          ctaLabel: s.ctaLabel,
          ctaHref: s.ctaHref,
          sortOrder: i,
          isVisible: s.isVisible,
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed to save home page");
      return;
    }
    setSections(data.page.sections);
    setMessage("Home page saved");
    router.refresh();
  }

  async function createHomePage() {
    setMessage(null);
    const res = await fetch("/api/admin/cms/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "home",
        title: "Home",
        status: "published",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed to create home page");
      return;
    }
    setMessage("Home page created");
    router.refresh();
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      {
        id: "",
        key: `section-${prev.length + 1}`,
        title: "",
        subtitle: "",
        body: "",
        ctaLabel: "",
        ctaHref: "",
        sortOrder: prev.length,
        isVisible: true,
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardTitle>Site settings</CardTitle>
        <form onSubmit={saveSite} className="mt-4 space-y-3">
          <div>
            <Label>Site name</Label>
            <Input
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={form.tagline ?? ""}
              onChange={(e) =>
                setForm({ ...form, tagline: e.target.value || null })
              }
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone ?? ""}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value || null })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email ?? ""}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value || null })
                }
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              rows={2}
              value={form.address ?? ""}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value || null })
              }
            />
          </div>
          <div>
            <Label>Footer text</Label>
            <Textarea
              rows={2}
              value={form.footerText ?? ""}
              onChange={(e) =>
                setForm({ ...form, footerText: e.target.value || null })
              }
            />
          </div>
          <Button type="submit">Save settings</Button>
        </form>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Home page sections</CardTitle>
          {home ? (
            <div className="flex items-center gap-2">
              <Select
                value={pageStatus}
                onChange={(e) => setPageStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
              <Button type="button" variant="secondary" onClick={addSection}>
                Add section
              </Button>
              <Button type="button" onClick={saveHome}>
                Save home
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={createHomePage}>
              Create home page
            </Button>
          )}
        </div>

        {home && (
          <div className="mt-4 space-y-4">
            {sections.map((s, idx) => (
              <div
                key={s.id || `new-${idx}`}
                className="rounded-md border border-[var(--border)] p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Key</Label>
                    <Input
                      value={s.key}
                      onChange={(e) => {
                        const next = [...sections];
                        next[idx] = { ...s, key: e.target.value };
                        setSections(next);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={s.title ?? ""}
                      onChange={(e) => {
                        const next = [...sections];
                        next[idx] = { ...s, title: e.target.value };
                        setSections(next);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Body</Label>
                    <Textarea
                      rows={3}
                      value={s.body ?? ""}
                      onChange={(e) => {
                        const next = [...sections];
                        next[idx] = { ...s, body: e.target.value };
                        setSections(next);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={s.isVisible}
                      onChange={(e) => {
                        const next = [...sections];
                        next[idx] = { ...s, isVisible: e.target.checked };
                        setSections(next);
                      }}
                    />
                    <Label className="mb-0">Visible</Label>
                  </div>
                  <div>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        setSections(sections.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No sections yet.</p>
            )}
          </div>
        )}
      </Card>

      {message && <p className="text-sm text-[var(--muted)]">{message}</p>}
    </div>
  );
}
