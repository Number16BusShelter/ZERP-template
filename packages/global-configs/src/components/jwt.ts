import { REQ } from "./rules";
import isProd from "./app";

export default {
    secret: process.env.JWT_SECRET_KEY || REQ("JWT_SECRET_KEY"),
    algorithm: "HS256",
    // JWT expiration in seconds
    expiration: 5 * 60 * 60,
    refreshExpiration: 60 * 60 * 24 * 7,
    ignoreExpiration: true,
};

