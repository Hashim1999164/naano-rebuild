import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("naano_session")?.value;
  const path = req.nextUrl.pathname;
  const gated = path.startsWith("/app") || path === "/creator" || path.startsWith("/creator/");
  if (gated && !token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/creator", "/creator/:path*"],
};
