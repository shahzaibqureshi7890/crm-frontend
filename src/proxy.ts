import { NextRequest, NextResponse } from "next/server";

const PUBLIC_AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  const isAuthenticated = Boolean(token);

  const isAuthPage = PUBLIC_AUTH_ROUTES.includes(pathname);

  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAuthenticated && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
