import express from "express";
import { apiLogger } from "../../server";
import { handleResponse, ServiceResponse } from "./serviceResponse";
import { processServerError } from "./errorProcessor";

/**
 * Error handler that wraps an asynchronous function and handles errors.
 *
 * @param {Function} fn - The asynchronous function to be executed.
 * @param {express.Response} res - The Express response object.
 * @param {express.Request} [req] - The Express request object (optional).
 * @returns {Promise<any>} The result of the function or the error response.
 */
export const errorHandler = async (fn: Function, res: express.Response, req?: express.Request): Promise<any> => {
    try {
        return handleResponse(ServiceResponse.json(await fn()), res);
    } catch (err: any) {
        return handleResponse(ServiceResponse.error(processServerError(err, req)), res);
    }
};

export const asyncErrorHandler = (fn: Function) => (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Middleware to report errors and respond with a processed error message.
 *
 * @param {any} err - The error object.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The Express next middleware function.
 */
export const reportError = (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        handleResponse(ServiceResponse.error(processServerError(err, req)), res);
        next();
    } catch (e: any) {
        apiLogger.error({
            message: `Failed to process failed request. This issue should be reported!`
                + `Error: ${err.message}\nStack: ${err.stack}\n\n`
                + `Error on processing: ${e.message}\nStack: ${e.stack}`,
            error: err,
            stack: err.stack
        });
        res.status(502).end();
    }
};
