import { rateLimit } from "express-rate-limit";
import { security } from "@/config";

export const rateLimiter = rateLimit(security.rateLimit);
