import {NextRequest, NextResponse} from 'next/server';
import {ScheduleListResponse, ScheduleResponse} from "@/interfaces/schedule";
import {getToken} from "next-auth/jwt";
import {SCHEDULE_URL} from "@/utils/api_consts";
import {ApiErrorResponse} from "@/interfaces/api_response";
import {commonErrorResponse, getCommonHeaders} from "@/utils/utils";

const serverError: ApiErrorResponse = {status: -1, message: "Server Error"}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
        return NextResponse.json({status: -1, message: "Unauthorized"}, {status: 401});
    }

    const cookieHeader = token.cookies;

    try {
        const queryString = req.nextUrl.searchParams.toString();
        const url = queryString ? `${SCHEDULE_URL}?${queryString}` : SCHEDULE_URL;

        const headers = getCommonHeaders(req, cookieHeader!);

        const response = await fetch(
            url,
            {
                credentials: "include",
                headers: headers
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const data: ScheduleListResponse = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
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
        const data = await req.json();
        const response = await fetch(
            `${SCHEDULE_URL}`,
            {
                method: "POST",
                body: JSON.stringify(data),
                credentials: "include",
                headers: headers
            }
        )

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const result: ScheduleResponse = await response.json();
        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}