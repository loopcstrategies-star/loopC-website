"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label, Select } from "@/components/ui/input";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "";
  const cycle = searchParams.get("cycle") ?? "MONTHLY";

  const [form, setForm] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    country: "IN",
    employees: "1",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.companyName,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        country: form.country,
        employees: Number(form.employees) || 1,
        planSlug: plan || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Signup failed");
      return;
    }

    const signed = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (signed?.error) {
      setError("Account created — please log in");
      router.push("/login");
      return;
    }

    if (plan && !data.enterprise) {
      router.push(`/checkout?plan=${encodeURIComponent(plan)}&cycle=${cycle}`);
    } else {
      router.push("/app");
    }
    router.refresh();
  }

  return (
    <Card className="w-full max-w-lg">
      <CardTitle>Create your LoopC workspace</CardTitle>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {plan
          ? `Selected plan: ${plan}${cycle ? ` · ${cycle === "YEARLY" ? "Yearly" : "Monthly"}` : ""}`
          : "You can pick a plan after signup."}
      </p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            required
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="AE">UAE</option>
            <option value="SG">Singapore</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="employees">Employees</Label>
          <Input
            id="employees"
            type="number"
            min={1}
            value={form.employees}
            onChange={(e) => set("employees", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldError>{error}</FieldError>
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </div>
      </form>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
