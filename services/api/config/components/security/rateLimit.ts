import express from "express";
import { getObjectHash } from "@zerp/utils";
import { getRemoteAddress } from "@/src/server/common/utils/ip";

export default {
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    keyGenerator: (req: express.Request) => getRemoteAddress(req) ?? getObjectHash(req.headers),
}
