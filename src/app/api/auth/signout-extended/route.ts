import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
    const cookieStore = await cookies();

    // Clear the NextAuth JWT cookie
    // The cookie name is "__Secure-next-auth.session-token" on HTTPS and "next-auth.session-token" on HTTP
    const sessionCookieName = process.env.NODE_ENV === 'production'
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    cookieStore.set(sessionCookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0), // Expire immediately
    });

    // Optional: clear the legacy next-auth.csrf-token
    cookieStore.set("next-auth.csrf-token", "", {
        path: "/",
        expires: new Date(0),
    });

    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL));
}
