import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { JWT } from "@auth/core/jwt";
import { prisma } from "@/server/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type AppJwt = JWT & {
  userId?: string;
  isSuperAdmin?: boolean;
  companyId?: string | null;
};

declare module "next-auth" {
  interface User {
    isSuperAdmin?: boolean;
    companyId?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isSuperAdmin: boolean;
      companyId: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId?: string;
    isSuperAdmin?: boolean;
    companyId?: string | null;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            memberships: {
              orderBy: { createdAt: "asc" },
              take: 1,
            },
          },
        });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isSuperAdmin: user.isSuperAdmin,
          companyId: user.memberships[0]?.companyId ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const t = token as AppJwt;

      if (user) {
        t.userId = user.id;
        t.isSuperAdmin = Boolean(user.isSuperAdmin);
        t.companyId = user.companyId ?? null;
        t.email = user.email ?? undefined;
        t.name = user.name ?? undefined;
      }

      if (trigger === "update" && session && typeof session === "object") {
        const companyId = (session as { companyId?: string | null }).companyId;
        if (companyId !== undefined) {
          t.companyId = companyId;
        }
      }

      if (t.userId && (user || trigger === "update")) {
        const dbUser = await prisma.user.findUnique({
          where: { id: t.userId },
          include: {
            memberships: {
              orderBy: { createdAt: "asc" },
              take: 1,
            },
          },
        });
        if (dbUser) {
          t.isSuperAdmin = dbUser.isSuperAdmin;
          t.email = dbUser.email;
          t.name = dbUser.name;
          if (t.companyId == null) {
            t.companyId = dbUser.memberships[0]?.companyId ?? null;
          }
        }
      }

      return t;
    },
    async session({ session, token }) {
      const t = token as AppJwt;
      session.user.id = t.userId ?? "";
      session.user.email = (t.email as string) ?? "";
      session.user.name = (t.name as string) ?? "";
      session.user.isSuperAdmin = Boolean(t.isSuperAdmin);
      session.user.companyId = t.companyId ?? null;
      return session;
    },
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
        return !!session?.user;
      }
      return true;
    },
  },
});
