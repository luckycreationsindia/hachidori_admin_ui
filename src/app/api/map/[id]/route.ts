import {NextRequest, NextResponse} from "next/server";
import {ApiErrorResponse} from "@/interfaces/api_response";
import {getToken} from "next-auth/jwt";
import {MAP_URL} from "@/utils/api_consts";
import {MapResponse} from "@/interfaces/waypoint";

const origin = process.env.NEXTAUTH_URL!;
const serverError: ApiErrorResponse = {status: -1, message: "Server Error"}

type Context = {
    params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: Context): Promise<NextResponse> {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
        return NextResponse.json({status: -1, message: "Unauthorized"}, {status: 401});
    }

    const cookieHeader = token.cookies;

    try {
        const {id} = await context.params;
        const response = await fetch(
            `${MAP_URL}/${id}`,
            {
                credentials: "include",
                headers: {
                    'Origin': req.headers.get("origin") ?? origin,
                    Cookie: cookieHeader!,
                }
            }
        );

        if (!response.ok) {
            try {
                const data = await response.json() as ApiErrorResponse;
                if(data && data.status && data.message) {
                    return NextResponse.json(data, {status: 500});
                } else {
                    return NextResponse.json(serverError, {status: 500})
                }
            } catch {
                return NextResponse.json(serverError, {status: 500})
            }
        }

        const data = await response.json() as MapResponse;
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}