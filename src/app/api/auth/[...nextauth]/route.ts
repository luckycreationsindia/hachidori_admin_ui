import NextAuth from "next-auth";
import {createAuthOptions} from "@/auth.config";
import {NextRequest} from "next/server";

interface RouteHandlerContext {
    params: Promise<{ nextauth: string[] }>
}

async function auth(req: NextRequest, context: RouteHandlerContext) {
    return await NextAuth(req, context, createAuthOptions(req));
}

export {auth as GET, auth as POST};