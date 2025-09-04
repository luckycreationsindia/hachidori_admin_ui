import type {NextRequest} from "next/server";
import {RequestInternal} from "next-auth";
import type {ReadonlyHeaders} from "next/dist/server/web/spec-extension/adapters/headers";

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