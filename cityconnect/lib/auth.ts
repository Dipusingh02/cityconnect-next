import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface JwtPayload {
  id: string;
  email: string;
  [key: string]: string | number | boolean; // Replace `any` with more specific types
}

// Verify token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
  } catch {
    return null;
  }
}

// Get token from cookie
export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookie = await cookies().get("token");
  return cookie?.value;
}

// Set token to cookie
export async function setTokenCookie(token: string): Promise<void> {
  await cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
    sameSite: "strict",
  });
}

// Generate a new JWT token
export function generateToken(userId: string, email: string): string {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET_KEY!, { expiresIn: "30d" });
}

// Auth function usable in route handlers
export async function authenticate(): Promise<JwtPayload | null> {
  const token = await getTokenFromCookies();
  return token ? verifyToken(token) : null;
}

// Auth function usable in middleware.ts
export function authenticateRequest(request: NextRequest): JwtPayload | null {
  const cookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.split(" ")[1];
  const token = cookieToken || headerToken;

  return token ? verifyToken(token) : null;
}

// ✅ Middleware wrapper for protected API routes
type HandlerFunction = (req: NextRequest, context: { user: JwtPayload }) => Promise<NextResponse>;

export function authenticateToken(handler: HandlerFunction): HandlerFunction {
  return async (req, context) => {
    const cookieToken = req.cookies.get("token")?.value;
    const authHeader = req.headers.get("authorization");
    const headerToken = authHeader?.split(" ")[1];
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 403 });
    }

    // Optional: Attach user to context for downstream access
    context.user = decoded;

    return handler(req, context);
  };
}
