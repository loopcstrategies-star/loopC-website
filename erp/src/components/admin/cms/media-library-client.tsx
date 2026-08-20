"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

type Asset = {
  id: string;
  filename: string;
  url: string;
  mimeType: string | null;
  sizeBytes: number | null;
  altText: string | null;
  createdAt: Date;
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function MediaLibraryClient({ assets: initial }: { assets: Asset[] }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initial);
  const [form, setForm] = useState({ filename: "", url: "", altText: "" });
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = assets.filter(
    (a) =>
      !search ||
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      (a.altText ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  async function addAsset() {
    if (!form.filename || !form.url) return;
    setAdding(true);
    setMessage(null);
    const res = await fetch("/api/admin/cms/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setAdding(false);
    if (!res.ok) {
      setMessage(data.error ?? "Failed to add");
      return;
    }
    setAssets((prev) => [data.asset, ...prev]);
    setForm({ filename: "", url: "", altText: "" });
    setMessage("Asset added");
    router.refresh();
  }

  async function deleteAsset(id: string) {
    if (!confirm("Delete this asset?")) return;
    const res = await fetch(`/api/admin/cms/media?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      setMessage("Asset deleted");
    }
  }

  function copyUrl(url: string) {
    void navigator.clipboard.writeText(url);
    setMessage("URL copied to clipboard");
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* Add asset */}
      <Card className="p-4 space-y-3">
        <p className="font-semibold text-sm">Add asset (URL-based)</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label>Filename</Label>
            <Input
              value={form.filename}
              onChange={(e) => setForm((p) => ({ ...p, filename: e.target.value }))}
              placeholder="hero-image.jpg"
            />
          </div>
          <div>
            <Label>URL</Label>
            <Input
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Alt text</Label>
            <Input
              value={form.altText}
              onChange={(e) => setForm((p) => ({ ...p, altText: e.target.value }))}
              placeholder="Descriptive alt text"
            />
          </div>
        </div>
        <Button type="button" onClick={addAsset} disabled={adding || !form.filename || !form.url}>
          {adding ? "Adding…" : "Add asset"}
        </Button>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search assets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-[var(--muted)]">{filtered.length} assets</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No assets found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
            >
              {asset.mimeType?.startsWith("image/") || asset.url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.url}
                  alt={asset.altText ?? asset.filename}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-[var(--surface-2)] text-3xl text-[var(--muted)]">
                  📄
                </div>
              )}
              <div className="p-3">
                <p className="truncate text-sm font-medium">{asset.filename}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {formatBytes(asset.sizeBytes)}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset.url)}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAsset(asset.id)}
                    className="text-xs font-semibold text-[var(--danger)] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
