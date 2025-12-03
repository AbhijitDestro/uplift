import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for session token in cookies
  const sessionToken = request.cookies.get("session_token") || request.cookies.get("better-auth.session_token");
  const isAuth = !!sessionToken;
  const { pathname } = request.nextUrl;

  // Define public routes
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // If user is authenticated and tries to access sign-in or sign-up, redirect to dashboard
  if (isAuth && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is NOT authenticated and tries to access a private route, redirect to sign-in
  if (!isAuth && !isPublicRoute) {
    // Special case for root path - redirect to sign-in
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // For all other private routes, redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};