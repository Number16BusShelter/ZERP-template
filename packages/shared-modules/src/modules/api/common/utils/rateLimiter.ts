import { rateLimit } from "express-rate-limit";
import { security } from "@zerp/global-configs";

export const rateLimiter = rateLimit(security.rateLimit);
