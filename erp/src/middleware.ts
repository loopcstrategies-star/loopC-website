import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function isAdminHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "admin.loopcstrategies.com" || h.startsWith("admin.");
}

function isPortalAllowedOnAdminHost(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // admin.* serves Super Admin only (same Next deploy)
  if (isAdminHost(host) && !isPortalAllowedOnAdminHost(pathname)) {
    if (pathname === "/" || pathname.startsWith("/app") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }
    if (pathname.startsWith("/checkout") || pathname.startsWith("/pricing")) {
      const portal =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || req.nextUrl.origin;
      return NextResponse.redirect(new URL(pathname + req.nextUrl.search, portal));
    }
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

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
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
