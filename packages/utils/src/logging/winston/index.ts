import { LoggerConfig } from "@zerp/types";
import winston, { Logger } from "winston";
import { formatLog } from "../common";

export { createErrorListener } from "./createErrorListener";

const isProd = process.env.NODE_ENV == "production";

export const createLogger = (options: LoggerConfig): Logger => {
    const readableFormat = winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.printf(
            (info) =>
                // https://stackoverflow.com/a/69044670/20358783 more detailLocaleString
                formatLog(info, isProd),
        ),
        (isProd
                ? winston.format.uncolorize()
                : winston.format.colorize({
                    level: true,
                    all: true,
                    colors: {
                        log: "cyan",
                        info: "white",
                        http: "white",
                    },
                })
        ),
    );

    options = {
        service: "app",
        ...options,
    };

    const logger = winston.createLogger({
        level: options.level ?? "info",
        exitOnError: false,
        // format: winston.format.json(),
        format: isProd ? winston.format.json() : readableFormat,
        defaultMeta: {
            service: options.defaultMeta,
            name: options.name,
            subModule: options.subModule,
        },
        transports: [
            new winston.transports.Console(),
            // new winston.transports.File({
            //     filename: `./logs/${options.service}/${options.level}.log`,
            // }),
        ],
    });

    return logger;
};

export {
    Logger as AppLogger,
};


