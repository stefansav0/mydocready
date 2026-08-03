import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;

  // Preserve localhost and preview domains during development.
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next();
  }

  if (hostname === "mydocready.com") {
    const url = request.nextUrl.clone();
    url.hostname = "www.mydocready.com";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
