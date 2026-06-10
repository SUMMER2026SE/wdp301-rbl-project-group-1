import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has("refresh_token");

  if (pathname.startsWith("/tutor/")) {
    const pathParts = pathname.split("/");
    const id = pathParts[2];
    // If it is, and there's no token, we still allow it (it's public).
    // The private paths are usually named words like 'home', 'schedule', etc.
    const isPublicProfile = /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-fA-F-]{36}$/.test(id);

    if (isPublicProfile) {
      return NextResponse.next();
    }
  }

  // If no token exists and the user is trying to access a protected route
  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    // Optionally save the callback URL to redirect them back after successful login
    loginUrl.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/payment/:path*",
    "/student/:path*",
    "/tutor/:path*",
  ],
};
