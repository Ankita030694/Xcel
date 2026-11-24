import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Normalize uppercase blog slugs at the edge with a single 308 permanent redirect
  if (pathname.startsWith("/blogs/")) {
    const lowered = pathname.toLowerCase();
    if (pathname !== lowered) {
      const url = request.nextUrl.clone();
      url.pathname = lowered;
      url.search = search;
      return NextResponse.redirect(url, 308);
    }
  }

  // Normalize uppercase hyphenated product slugs (preserving case-sensitive Firestore doc IDs)
  if (pathname.startsWith("/product/")) {
    const segment = pathname.slice("/product/".length);
    if (segment.includes("-") && segment !== segment.toLowerCase()) {
      const url = request.nextUrl.clone();
      url.pathname = `/product/${segment.toLowerCase()}`;
      url.search = search;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/blogs/:path*"],
};
