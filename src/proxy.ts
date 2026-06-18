import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if trying to access admin routes and not ADMIN
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      // Redirect to home page
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if there is a token (authenticated)
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply this middleware to protect admin, checkout, and orders pages
export const config = {
  matcher: ["/admin/:path*", "/checkout", "/orders/:path*"],
};
