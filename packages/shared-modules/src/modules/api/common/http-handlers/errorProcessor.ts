import express from "express";
import { v4 as uuid } from "uuid";
import { getRemoteAddress } from "../utils/ip";
import { ServerResponse } from "@zerp/types";
import { ServerError } from "@zerp/errors";
import { app } from "@zerp/global-configs";
import { apiLogger } from "../../server";

/**
 * Converts an Express request object into a structured log object.
 *
 * @param {express.Request} req - The Express request object.
 * @returns {object} A log object containing request details.
 */
const toRequestLog = (req: express.Request): object => {
    return {
        id: uuid().toString(),
        url: req ? req.url : null,
        headers: req ? req.headers : {},
        body: req ? req.body : {},
        query: req ? req.query : {},
        cookies: req ? req.cookies : {},
        timestamp: new Date().getTime(),
        ip: req ? getRemoteAddress(req) : null,
        user: req && req['user'] ? req['user']["id"] : null,
    };
};

/**
 * Processes a server error and logs detailed information if necessary.
 *
 * @param {any} err - The error object to be processed.
 * @param {express.Request} [req] - The Express request object (optional).
 * @returns {ServerResponse} A structured server response object.
 */
export const processServerError = (err: any, req?: express.Request): ServerResponse => {
    const nerr = (err !instanceof ServerError) ? new ServerError(err) : err;

    let httpStatusCode: number = err.httpCode ?? err.statusCode ?? nerr.code
    httpStatusCode = httpStatusCode < 600 ? httpStatusCode : nerr.code < 600 ? nerr.code : 500

    if ((httpStatusCode && httpStatusCode >= 500) || !err.code || app.debug) {
        const reqView = req ? toRequestLog(req) : null;
        apiLogger.http({
            message: `Server error occurred (${httpStatusCode}): `
                + err.message
                + `\nRequest: ${JSON.stringify(reqView, null, 2)}`
                + `\n${err.stack}\n`
            ,
            request: reqView,
            stack: err.stack,
            error: err,
        });
    }

    return {
        code: httpStatusCode,
        statusCode: err.httpCode ?? err.statusCode ?? 500,
        message: err.message,
    };
};
