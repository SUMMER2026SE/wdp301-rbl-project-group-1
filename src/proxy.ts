import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to decode JWT payload safely in edge runtime
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const AUTH_PAGES = [
  "/login",
  "/register",
  "/register-tutor",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // 1. If user has a refresh token and tries to access an auth page or the root ("/")
  if (refreshToken) {
    const payload = decodeJwt(refreshToken);
    const role = payload?.role;
    const exp = payload?.exp;

    // Check if token is expired (exp is in seconds)
    if (exp && exp * 1000 < Date.now()) {
      // Token expired, delete the cookie and let the request proceed normally
      const response = NextResponse.next();
      response.cookies.delete("refresh_token");
      return response;
    }

    const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));
    const isRootPage = pathname === "/";

    if (isAuthPage || isRootPage) {
      if (role === "TUTOR") {
        return NextResponse.redirect(new URL("/tutor/home", request.url));
      } else if (role === "STUDENT") {
        return NextResponse.redirect(new URL("/student/home", request.url));
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/home", request.url));
      }
      
      // Default fallback if role is unrecognized but token exists
      return NextResponse.redirect(new URL("/student/home", request.url));
    }
  }

  // 2. If no token exists and the user is trying to access a protected route
  if (!refreshToken) {
    // Allow public tutor profiles (e.g. /tutor/<uuid>)
    if (pathname.startsWith("/tutor/")) {
      const pathParts = pathname.split("/");
      const id = pathParts[2];
      const isPublicProfile =
        /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-fA-F-]{36}$/.test(id);

      if (isPublicProfile) {
        return NextResponse.next();
      }
    }

    const isProtectedRoute =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/payment") ||
      pathname.startsWith("/student") ||
      pathname.startsWith("/tutor");

    if (isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/register-tutor",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
    "/admin/:path*",
    "/payment/:path*",
    "/student/:path*",
    "/tutor/:path*",
  ],
};
