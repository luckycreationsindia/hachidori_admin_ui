import {NextRequest, NextResponse} from "next/server";
import {ApiErrorResponse} from "@/interfaces/api_response";
import {getToken} from "next-auth/jwt";
import {MAP_URL} from "@/utils/api_consts";
import {MapResponse} from "@/interfaces/waypoint";
import {commonErrorResponse, getCommonHeaders} from "@/utils/utils";

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
        const headers = getCommonHeaders(req, cookieHeader!);
        const {id} = await context.params;
        const response = await fetch(
            `${MAP_URL}/${id}`,
            {
                credentials: "include",
                headers: headers,
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const data = await response.json() as MapResponse;
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}