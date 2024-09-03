// import winston from "winston";
// import bunyan from "bunyan";
//
// import { createLogger as createBunyanLogger } from "./bunyan"

import { createLogger as createWinstonLogger, createErrorListener, AppLogger } from "./winston";

export * from "./common";
const createLogger = createWinstonLogger


export {
    createLogger,
    createErrorListener,
    AppLogger
};
export default createLogger;
