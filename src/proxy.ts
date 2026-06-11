import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * Next.js 16 renamed the `middleware` convention to `proxy` (Node.js runtime).
 * Protects /account by verifying our self-managed signed session cookie.
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Both /account and /admin require a valid session. The admin-only role check
  // happens in the /admin page itself (it can read isAdmin from the session).
  if (pathname.startsWith("/account") || pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = await verifySessionToken(token);
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
