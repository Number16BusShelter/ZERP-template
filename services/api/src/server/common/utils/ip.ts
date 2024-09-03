import express from "express";
import { logger } from "@/src/server/logger";

function getClientIp(request: express.Request) {
    // Check if the request is coming through Cloudflare
    const proxyHeaders = [
        "x-client-ip",
        "cf-connecting-ip",
        "true-client-ip",
        "x-real-ip",
        "x-forwarded",
        "forwarded",
        "forwarded-for",
        "x-forwarded-for",
    ];

    for (const header of proxyHeaders) {
        const headerValue = processHeader(request, header);
        if (headerValue) return headerValue;
    }

    // If no special headers are present, return the remote address
    return request.ip ?? request.socket.remoteAddress;
}

function processHeader(
    req: express.Request,
    header: string,
): string | undefined {
    const headerValue = req.headers[header];
    if (!headerValue) {
        return undefined;
    }
    const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!value) {
        return;
    }
    const parts = value.split(",");
    const ip = parts[0]?.trim();
    if (ip) {
        return ip;
    }
    return undefined;
}

export function getRemoteAddress(req: express.Request): string | null {
    try {
        return getClientIp(req);
    } catch (error) {
        logger.error(error)
        return null;
    }
}
