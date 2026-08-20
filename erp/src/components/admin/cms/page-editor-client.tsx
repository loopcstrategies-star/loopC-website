"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

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

export function PageEditorClient({
  page,
  pageLabel,
}: {
  page: Page | null;
  pageLabel: string;
}) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(page?.sections ?? []);
  const [pageStatus, setPageStatus] = useState(page?.status ?? "draft");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateSection(index: number, field: keyof Section, value: string | boolean) {
    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      {
        id: "",
        key: `section-${prev.length + 1}`,
        title: null,
        subtitle: null,
        body: null,
        ctaLabel: null,
        ctaHref: null,
        sortOrder: prev.length,
        isVisible: true,
      },
    ]);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!page) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/cms/pages/${page.id}`, {
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
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Failed to save");
      return;
    }
    setMessage("Page saved");
    router.refresh();
  }

  if (!page) {
    return (
      <Card className="p-6">
        <p className="text-[var(--muted)]">
          No {pageLabel} page found in the database. Run the CMS seed to create it.
        </p>
        <pre className="mt-3 rounded bg-[var(--surface-2)] px-3 py-2 text-xs">
          npx tsx prisma/seed-cms.ts
        </pre>
      </Card>
    );
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {message && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div>
            <Label>Page status</Label>
            <select
              className="mt-1 rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"
              value={pageStatus}
              onChange={(e) => setPageStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </Card>

      {sections.map((section, i) => (
        <Card key={section.id || i} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Section: {section.key}</CardTitle>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={section.isVisible}
                onChange={(e) => updateSection(i, "isVisible", e.target.checked)}
                className="h-4 w-4"
              />
              Visible
            </label>
          </div>
          <div>
            <Label>Section key</Label>
            <Input
              value={section.key}
              onChange={(e) => updateSection(i, "key", e.target.value)}
              placeholder="hero, intro, benefits..."
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={section.title ?? ""}
              onChange={(e) => updateSection(i, "title", e.target.value)}
            />
          </div>
          <div>
            <Label>Subtitle / Supporting text</Label>
            <Textarea
              value={section.subtitle ?? ""}
              onChange={(e) => updateSection(i, "subtitle", e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <Label>Body content</Label>
            <Textarea
              value={section.body ?? ""}
              onChange={(e) => updateSection(i, "body", e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CTA label</Label>
              <Input
                value={section.ctaLabel ?? ""}
                onChange={(e) => updateSection(i, "ctaLabel", e.target.value)}
              />
            </div>
            <div>
              <Label>CTA link</Label>
              <Input
                value={section.ctaHref ?? ""}
                onChange={(e) => updateSection(i, "ctaHref", e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="w-full rounded-lg border border-dashed border-[var(--border)] py-3 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        + Add section
      </button>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save page"}
      </Button>
    </form>
  );
}
