import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected =
    pathname.startsWith("/app") || pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/admin") && !token.isSuperAdmin) {
    return NextResponse.redirect(new URL("/app", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
