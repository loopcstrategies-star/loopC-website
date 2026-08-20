import { redirect } from "next/navigation";

/** Admin “Pricing” maps to plan management — single source of truth. */
export default function AdminPricingAliasPage() {
  redirect("/admin/plans");
}
