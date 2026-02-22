import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { isAdminOrStaff } from "@/lib/auth/roles";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
    const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/admin");

    if (isAuthRoute) {
        if (isLoggedIn) {
            const role = req.auth?.user?.role;
            const redirectUrl = isAdminOrStaff(role) ? "/admin" : "/dashboard";
            return NextResponse.redirect(new URL(redirectUrl, nextUrl));
        }
        return NextResponse.next();
    }

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
