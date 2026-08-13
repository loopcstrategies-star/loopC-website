"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  authorName: string | null;
  isPublished: boolean;
  category: { id: string; name: string } | null;
};

export function BlogClient({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/cms/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt: excerpt || null,
        content: content || null,
        authorName: authorName || null,
        categoryName: categoryName || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setTitle("");
    setExcerpt("");
    setContent("");
    setAuthorName("");
    setCategoryName("");
    setMessage("Created");
    router.refresh();
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/cms/blog/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editing.title,
        excerpt: editing.excerpt,
        content: editing.content,
        authorName: editing.authorName,
        isPublished: editing.isPublished,
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

  async function togglePublish(post: Post) {
    await fetch(`/api/admin/cms/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/cms/blog/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Create post</CardTitle>
        <form onSubmit={create} className="mt-4 grid gap-3">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Author</Label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Excerpt</Label>
            <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </Card>

      {editing && (
        <Card>
          <CardTitle>Edit post</CardTitle>
          <form onSubmit={saveEdit} className="mt-4 grid gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Input
                value={editing.excerpt ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, excerpt: e.target.value || null })
                }
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                rows={5}
                value={editing.content ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value || null })
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
        <CardTitle>Posts</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Category</th>
                <th className="py-2">Published</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{p.title}</td>
                  <td className="py-2">{p.category?.name ?? "—"}</td>
                  <td className="py-2">{p.isPublished ? "Yes" : "No"}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => togglePublish(p)}>
                      {p.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => remove(p.id)}>
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
