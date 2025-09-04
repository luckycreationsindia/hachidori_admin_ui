import {NextRequest, NextResponse} from "next/server";
import {ApiErrorResponse, ApiSuccessResponse} from "@/interfaces/api_response";
import {getToken} from "next-auth/jwt";
import {WORKFLOW_URL} from "@/utils/api_consts";
import {WorkflowResponse} from "@/interfaces/workflow";
import {commonErrorResponse} from "@/utils/utils";

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
            `${WORKFLOW_URL}/${id}`,
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

        const data = await response.json() as WorkflowResponse;
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
        const {id} = await context.params;
        const data = await req.json();
        const response = await fetch(
            `${WORKFLOW_URL}/${id}`,
            {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    'Origin': req.headers.get("origin") ?? origin,
                    Cookie: cookieHeader!,
                }
            }
        );

        const errorResponse = await commonErrorResponse(response);
        if (errorResponse) return errorResponse;

        const result = await response.json() as WorkflowResponse;
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
        const {id} = await context.params;
        const response = await fetch(
            `${WORKFLOW_URL}/${id}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Origin': req.headers.get("origin") ?? origin,
                    Cookie: cookieHeader!,
                }
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