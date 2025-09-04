import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";
import {PagesOptions} from "next-auth";
import {getIPFromRequest} from "@/utils/utils";

export default withAuth(
    function middleware(req) {
        const ip = getIPFromRequest(req);
        const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL!;
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-forwarded-for', ip);
        requestHeaders.set("x-origin", origin);
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        });
    },
    {
        callbacks: {
            authorized: ({token}) => {
                return !!token;
            },
        },
        pages: {
            signIn: "/login",
            error: "/login"
        } as Partial<PagesOptions>,
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: ["/((?!login|api/auth).*)"]
};
