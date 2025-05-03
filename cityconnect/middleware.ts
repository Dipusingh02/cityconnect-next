import { NextResponse, NextRequest } from "next/server";
import { authenticateRequest } from "./lib/auth";

export function middleware(request: NextRequest) {
  // Check if the path is an API route that should be protected
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");
  
  // Skip authentication for auth routes (login, register, etc.)
  if (isAuthRoute) {
    return NextResponse.next();
  }
  
  // Protect API routes
  if (isApiRoute) {
    const user = authenticateRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { message: "Access denied. No token provided or invalid token." },
        { status: 401 }
      );
    }
    
    // Clone the request headers to add the user info
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-email", user.email);
    
    // Forward the request with the added user info
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

// Configure which routes should use this middleware
export const config = {
  matcher: [
    // Apply to all API routes except auth routes
    "/api/:path*",
  ],
};