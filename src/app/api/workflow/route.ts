import {NextRequest, NextResponse} from 'next/server';
import {WorkflowListResponse} from "@/interfaces/workflow";
import {getToken} from "next-auth/jwt";
import {WORKFLOW_URL} from "@/utils/api_consts";
import {ApiErrorResponse} from "@/interfaces/api_response";
import {commonErrorResponse} from "@/utils/utils";

const origin = process.env.NEXTAUTH_URL!;
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
        const response = await fetch(
            `${WORKFLOW_URL}?${req.nextUrl.searchParams.toString() ?? ""}`,
            {
                credentials: "include",
                headers: {
                    'Origin': req.headers.get("origin") ?? origin,
                    Cookie: cookieHeader!,
                }
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const data = await response.json() as WorkflowListResponse;
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
        const data = await req.json();
        const response = await fetch(
            `${WORKFLOW_URL}`,
            {
                method: "POST",
                body: JSON.stringify(data),
                credentials: "include",
                headers: {
                    'Origin': req.headers.get("origin") ?? origin,
                    Cookie: cookieHeader!,
                    'Content-Type': 'application/json'
                }
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const result = await response.json() as WorkflowListResponse;
        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json(serverError, {status: 500})
    }
}