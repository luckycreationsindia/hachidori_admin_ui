import {NextRequest, NextResponse} from "next/server";
import {RequestInternal} from "next-auth";
import type {ReadonlyHeaders} from "next/dist/server/web/spec-extension/adapters/headers";
import {ApiErrorResponse} from "@/interfaces/api_response";

export const getIPFromRequestHeaders = (req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) => {
    const headers = req?.headers;

    if (!headers) return "127.0.0.1";

    const cfConnectingIp = headers["cf-connecting-ip"] || headers.get?.("cf-connecting-ip");
    if (cfConnectingIp) return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;

    const forwardedFor = headers["x-forwarded-for"] || headers.get?.("x-forwarded-for");
    if (forwardedFor) {
        return (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor).split(",")[0].trim();
    }

    const realIp = headers["x-real-ip"] || headers.get?.("x-real-ip");
    if (realIp) return Array.isArray(realIp) ? realIp[0] : realIp;

    return "127.0.0.1";
};

export const getIPFromRequestNextRequestHeaders = (headers: ReadonlyHeaders): string => {
    if (!headers) return "127.0.0.1";

    const cfConnectingIp = headers.get?.("cf-connecting-ip");
    if (cfConnectingIp) return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;

    const forwardedFor = headers.get?.("x-forwarded-for");
    if (forwardedFor) {
        return (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor).split(",")[0].trim();
    }

    const realIp = headers.get?.("x-real-ip");
    if (realIp) return Array.isArray(realIp) ? realIp[0] : realIp;

    return "127.0.0.1";
};

export const getIPFromRequest = (req: NextRequest) => {
    const cfConnectingIp = req.headers.get("cf-connecting-ip");
    if (cfConnectingIp) {
        return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor).split(",")[0].trim();
    }

    const realIp = req.headers.get("x-real-ip");
    if (realIp) {
        return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    return "127.0.0.1";
};

const serverError: ApiErrorResponse = {status: -1, message: "Server Error"}
export const commonErrorResponse = async (response: Response): Promise<NextResponse<ApiErrorResponse> | null> => {
    if (!response.ok) {
        try {
            const data = await response.json() as ApiErrorResponse;
            if(data && data.status && data.message) {
                return NextResponse.json(data, {status: response.status});
            } else {
                return NextResponse.json(serverError, {status: response.status})
            }
        } catch {
            return NextResponse.json(serverError, {status: response.status})
        }
    }
    return null;
}

const fallbackOrigin = process.env.NEXTAUTH_URL!;
export const getCommonHeaders = (req: NextRequest, cookieHeader: string): Headers => {
    const headers = new Headers(req.headers);
    headers.set("Origin", req.headers.get("origin") ?? fallbackOrigin);
    headers.set("Cookie", cookieHeader!);

    return headers;
}