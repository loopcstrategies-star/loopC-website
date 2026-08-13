import { redirect } from "next/navigation";
import { requireSession, requireSuperAdmin } from "@/server/auth";

export async function requireAppSession() {
  const session = await requireSession().catch(() => null);
  if (!session?.user?.id) redirect("/login?callbackUrl=/app");
  if (!session.user.companyId) redirect("/signup");
  return session as typeof session & {
    user: { companyId: string };
  };
}

export async function requireAdminSession() {
  const session = await requireSuperAdmin().catch(() => null);
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  if (!session.user.isSuperAdmin) redirect("/app");
  return session;
}
