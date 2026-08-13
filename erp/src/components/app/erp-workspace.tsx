"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { formatInr } from "@/lib/constants";

type Party = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: string;
};

export function CustomersPanel({ initialParties }: { initialParties: Party[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/app/parties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "customer", name, email, phone }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not create customer");
      return;
    }
    setName("");
    setEmail("");
    setPhone("");
    router.refresh();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardTitle>Add customer</CardTitle>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <Label htmlFor="cust-name">Name</Label>
            <Input id="cust-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cust-email">Email</Label>
            <Input id="cust-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cust-phone">Phone</Label>
            <Input id="cust-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <FieldError>{error}</FieldError>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save customer"}
          </Button>
        </form>
      </Card>
      <Card>
        <CardTitle>Customers ({initialParties.length})</CardTitle>
        <div className="mt-4 space-y-2">
          {initialParties.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No customers yet.</p>
          )}
          {initialParties.map((p) => (
            <div
              key={p.id}
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-[var(--muted)]">
                {[p.email, p.phone].filter(Boolean).join(" · ") || "—"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

type CatalogItem = {
  id: string;
  name: string;
  kind: string;
  unitPriceInr: number;
  taxPercent: number;
};

type SalesInvoice = {
  id: string;
  number: string;
  status: string;
  totalInr: number;
  party: { name: string };
};

export function InvoicingPanel({
  initialItems,
  initialParties,
  initialInvoices,
}: {
  initialItems: CatalogItem[];
  initialParties: Party[];
  initialInvoices: SalesInvoice[];
}) {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [priceRupees, setPriceRupees] = useState("1000");
  const [partyId, setPartyId] = useState(initialParties[0]?.id ?? "");
  const [lineDesc, setLineDesc] = useState("Professional services");
  const [error, setError] = useState<string | null>(null);

  async function addProduct(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/app/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "service",
        name: productName,
        unitPriceInr: Math.round(Number(priceRupees) * 100),
        taxPercent: 18,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not add product");
      return;
    }
    setProductName("");
    router.refresh();
  }

  async function createInvoice(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const selected = initialItems[0];
    const unitPriceInr = selected?.unitPriceInr ?? Math.round(Number(priceRupees) * 100);
    const res = await fetch("/api/app/sales-invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partyId,
        lines: [
          {
            catalogItemId: selected?.id,
            description: lineDesc || selected?.name || "Line item",
            quantity: 1,
            unitPriceInr,
            taxPercent: selected?.taxPercent ?? 18,
          },
        ],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not create invoice");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Products & services</CardTitle>
          <form onSubmit={addProduct} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="prod-name">Name</Label>
              <Input
                id="prod-name"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="prod-price">Price (₹)</Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                step="1"
                value={priceRupees}
                onChange={(e) => setPriceRupees(e.target.value)}
              />
            </div>
            <Button type="submit">Add item</Button>
          </form>
          <ul className="mt-4 space-y-2 text-sm">
            {initialItems.map((item) => (
              <li key={item.id} className="flex justify-between border-t border-[var(--border)] pt-2">
                <span>{item.name}</span>
                <span>{formatInr(item.unitPriceInr)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle>Create sales invoice</CardTitle>
          <form onSubmit={createInvoice} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="inv-party">Customer</Label>
              <select
                id="inv-party"
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                required
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
              >
                <option value="">Select customer</option>
                {initialParties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="inv-desc">Description</Label>
              <Input
                id="inv-desc"
                value={lineDesc}
                onChange={(e) => setLineDesc(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!partyId}>
              Create invoice
            </Button>
          </form>
        </Card>
      </div>

      <FieldError>{error}</FieldError>

      <Card>
        <CardTitle>Sales invoices</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-2 font-medium">Number</th>
                <th className="py-2 font-medium">Customer</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {initialInvoices.map((inv) => (
                <tr key={inv.id} className="border-t border-[var(--border)]">
                  <td className="py-2">{inv.number}</td>
                  <td className="py-2">{inv.party.name}</td>
                  <td className="py-2">{inv.status}</td>
                  <td className="py-2">{formatInr(inv.totalInr)}</td>
                </tr>
              ))}
              {initialInvoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-[var(--muted)]">
                    No sales invoices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
