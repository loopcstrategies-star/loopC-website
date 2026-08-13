import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Redirect apex host to www (canonical production URL). */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const hostname = host.split(":")[0];

  if (hostname === "loopcstrategies.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "www.loopcstrategies.com";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
