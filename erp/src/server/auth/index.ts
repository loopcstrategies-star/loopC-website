import { auth, signIn, signOut, handlers } from "@/server/auth/config";

export { auth, signIn, signOut, handlers };

export type AppSession = NonNullable<Awaited<ReturnType<typeof auth>>>;

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    const err = new Error("Authentication required") as Error & { code: string };
    err.code = "UNAUTHORIZED";
    throw err;
  }
  return session;
}

export async function requireSuperAdmin() {
  const session = await requireSession();
  if (!session.user.isSuperAdmin) {
    const err = new Error("Super admin access required") as Error & { code: string };
    err.code = "FORBIDDEN";
    throw err;
  }
  return session;
}
