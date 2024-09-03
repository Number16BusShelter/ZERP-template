import rules from "./rules";
import { AppConfig } from "@zerp/types";

const env: string = process.env.NODE_ENV ?? "development";
export const isProd = env == "production";
export const isDev = env == "development";

const appRoot = process.env.PWD
    || process.env.WORKDIR
    || process.cwd();

const debug = Boolean(process.env.APP_DEBUG ?? env == "development");
const host = process.env.APP_HOST ? process.env.APP_HOST : rules.REQ("APP_HOST");
const port = process.env.APP_PORT ? process.env.APP_PORT : rules.REQ("APP_PORT");
const ssl = Boolean(process.env.APP_SSL_ENABLED ?? false);

const sld = process.env.APP_SLD;
const domain = process.env.APP_DOMAIN;
const handle = `${ssl ? "https" : "http"}://${domain ? domain : (host + ":" + port)}`;


const app: AppConfig = {
    // Common Config
    mode: env,
    service: process.env.SERVICE ?? "service",
    name: process.env.APP_NAME ?? "app",
    debug,
    host,
    port,
    sld,
    domain,
    handle,
    ssl,
    allowedOrigins: [
        ...[
            "0.0.0.0",
            "127.0.0.1",
            "localhost",
            // Ported client host
            "0.0.0.0:7272",
            "127.0.0.1:7272",
            "localhost:7272",
            // Paste your own //
            "example.com"
        ].map(h => [`http://${h}`, `https://${h}`, h]).flat(),
        ////////////////////
        // Only suitable for development
        // "*",
        `${host}`,
        ...(domain
                ? [`*.${domain}`, `${domain}`]
                : []
        ),
    ],
    rootDir: appRoot,
    mediaHost: process.env.MEDIA_HOST,
    staticHost: process.env.STATIC_HOST,
    testNet: Boolean(process.env.USE_MAINNET ?? false),
};

export default app as AppConfig;
