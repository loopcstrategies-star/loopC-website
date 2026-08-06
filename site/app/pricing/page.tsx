import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Pricing",
  description: "LoopC ERP pricing — Basic, Standard, Premium, and Custom Build.",
};

export default function PricingRedirectPage() {
  redirect("/erp/pricing");
}
