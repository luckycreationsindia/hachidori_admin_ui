import {NextRequest, NextResponse} from "next/server";
import {ApiErrorResponse, ApiSuccessResponse} from "@/interfaces/api_response";
import {getToken} from "next-auth/jwt";
import {SCHEDULE_URL} from "@/utils/api_consts";
import {ScheduleResponse} from "@/interfaces/schedule";
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
            `${SCHEDULE_URL}/${id}?${req.nextUrl.searchParams.toString() ?? ""}`,
            {
                credentials: "include",
                headers: headers
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const data = await response.json() as ScheduleResponse;
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}

export async function PUT(req: NextRequest, context: Context): Promise<NextResponse> {
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
        headers.set('Content-Type', 'application/json');
        const {id} = await context.params;
        const data = await req.json();
        const response = await fetch(
            `${SCHEDULE_URL}/${id}`,
            {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(data),
                headers: headers,
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const result = await response.json() as ScheduleResponse;
        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}

export async function DELETE(req: NextRequest, context: Context): Promise<NextResponse> {
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
            `${SCHEDULE_URL}/${id}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: headers
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const result = await response.json() as ApiSuccessResponse;
        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}