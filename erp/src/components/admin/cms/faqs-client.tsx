"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  pageSlug: string;
};

export function FaqsClient({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [pageSlug, setPageSlug] = useState("faq");
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Faq | null>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/cms/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        answer,
        pageSlug,
        sortOrder: faqs.length + 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setQuestion("");
    setAnswer("");
    setMessage("Created");
    router.refresh();
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/cms/faqs/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: editing.question,
        answer: editing.answer,
        pageSlug: editing.pageSlug,
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

  async function toggle(f: Faq) {
    await fetch(`/api/admin/cms/faqs/${f.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !f.isActive }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/cms/faqs/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Create FAQ</CardTitle>
        <form onSubmit={create} className="mt-4 grid gap-3">
          <div>
            <Label>Question</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} required />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} required />
          </div>
          <div>
            <Label>Page slug</Label>
            <Input value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </Card>

      {editing && (
        <Card>
          <CardTitle>Edit FAQ</CardTitle>
          <form onSubmit={saveEdit} className="mt-4 grid gap-3">
            <div>
              <Label>Question</Label>
              <Input
                value={editing.question}
                onChange={(e) => setEditing({ ...editing, question: e.target.value })}
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                rows={3}
                value={editing.answer}
                onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
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
        <CardTitle>FAQs</CardTitle>
        <div className="mt-4 space-y-3">
          {faqs.map((f) => (
            <div
              key={f.id}
              className="rounded-md border border-[var(--border)] p-3 text-sm"
            >
              <p className="font-medium">{f.question}</p>
              <p className="mt-1 text-[var(--muted)]">{f.answer}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {f.pageSlug} · {f.isActive ? "Active" : "Inactive"}
              </p>
              <div className="mt-2 space-x-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(f)}>
                  Edit
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toggle(f)}>
                  {f.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(f.id)}>
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
