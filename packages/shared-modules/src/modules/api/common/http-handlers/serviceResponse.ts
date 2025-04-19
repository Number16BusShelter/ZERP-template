import { ServerResponse } from "@zerp/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import express, { Response } from "express";
import { asyncErrorHandler } from "../http-handlers/handlers";

extendZodWithOpenApi(z);

/**
 * A class representing a service response, implementing the ServerResponse interface.
 *
 * @template T - The type of the data property.
 */
export class ServiceResponse<T = null> implements ServerResponse {
    readonly success: boolean;
    readonly code: string;
    readonly statusCode?: number;
    readonly data?: T;
    readonly message?: string;
    readonly errors?: any[];
    readonly stack?: any;

    /**
     * @param {ServerResponse<T>} params - The parameters for the service response.
     * @param {boolean} [params.success=true] - Indicates whether the operation was successful.
     * @param {number} [params.statusCode=200] - The HTTP status code.
     * @param {string} [params.code="200"] - The service-specific response code.
     * @param {T} [params.data] - The data to be returned in the response.
     * @param {string} [params.message] - The message associated with the response.
     * @param {any[]} [params.errors] - Any errors that occurred.
     * @param {any} [params.stack] - The error stack trace, if applicable.
     * @private
     */
    private constructor(
        {
            success = true,
            statusCode = 200,
            code = 200,
            data,
            message,
            errors,
            stack,
        }: ServerResponse<T>,
    ) {
        this.success = success;
        this.statusCode = statusCode;
        this.code = String(code);
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.stack = stack;
    }

    /**
     * Creates a successful JSON service response.
     *
     * @template T - The type of the data property.
     * @param {T} data - The data to be included in the response.
     * @param {Partial<Omit<ServerResponse<T>, "data">>} [options={}] - Additional options for the response.
     * @returns {ServiceResponse<T>} A new ServiceResponse instance.
     */
    static json<T>(data: T, options: Partial<Omit<ServerResponse<T>, "data">> = {}): ServerResponse<T> {
        return new ServiceResponse({
            success: true,
            statusCode: 200,
            data: data,
            ...options,
        });
    }

    /**
     * Creates a successful service response.
     *
     * @template T - The type of the data property.
     * @param {Omit<ServerResponse<T>, "success">} params - The parameters for the successful response.
     * @returns {ServiceResponse<T>} A new ServiceResponse instance.
     */

    static success<T>(params: Omit<ServerResponse<T>, "success">): ServerResponse<T> {
        return new ServiceResponse({
            success: true,
            ...params,
        });
    }

    /**
     * Creates an error service response.
     *
     * @template T - The type of the data property.
     * @param {Omit<ServerResponse<T>, "success">} params - The parameters for the error response.
     * @returns {ServiceResponse<T>} A new ServiceResponse instance.
     */
    static error<T>(params: Omit<ServerResponse<T>, "success">): ServerResponse<T> {
        return new ServiceResponse({
            success: false,
            statusCode: 500,
            code: "500",
            ...params,
        });
    }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(
    {
        dataSchema,
        success = true,
        statsCode = 200,
        code = "200",
        message = "Error message",
    }: {
        dataSchema: T,
        success?: boolean,
        statsCode?: number,
        code?: string,
        message?: string,
    }) =>
    z.object({
        success: z.boolean()
            .openapi({
                example: success ?? true,
            }).optional(),
        statusCode: z.number()
            .openapi({
                example: statsCode,
            }).optional(),
        code: z.string()
            .openapi({
                description: "Service response code. May missmatch http-code. See service error definitions.",
                example: code,
            }).optional(),
        message: z.string()
            .openapi({
                description: "Error message that shown to user",
                example: message ?? "Error message",
            }).optional(),
        data: dataSchema.optional(),
    });

/**
 * Handles and sends a service response.
 *
 * @param {ServerResponse | ServiceResponse} serviceResponse - The service response to be sent.
 * @param {Response} response - The Express response object.
 * @returns {Response} The Express response object with the service response JSON.
 */
export const handleResponse = (serviceResponse: ServerResponse | ServiceResponse, response: Response): Response => {
    return response.status(serviceResponse.statusCode ?? 200).json(serviceResponse);
};


/**
 * Wraps an Express route handler with async error handling and response formatting.
 *
 * @function handlerWrapper
 * @template T
 * @param {(req: express.Request, res: express.Response, next?: express.NextFunction) => any | Promise<any>} fn
 *   The original Express route handler function. It can be synchronous or asynchronous.
 *   The function should return the response data to be sent to the client.
 *
 * @returns {express.RequestHandler}
 *   A new Express-compatible request handler that:
 *   - Automatically catches and forwards errors (via asyncErrorHandler)
 *   - Formats and sends the response using `ServiceResponse.json()` and `handleResponse()`
 *
 * @example
 * app.get('/user', handlerWrapper(async (req, res) => {
 *   const user = await getUser(req.user.id);
 *   return { user };
 * }));
 *
 * @remarks
 * If your route handler sends the response manually (e.g., using `res.status().json()`),
 * avoid returning a value, or add support for `raw: true` in your custom logic to skip auto response.
 */
export const handlerWrapper = (fn: (req: express.Request, res: express.Response, next?: express.NextFunction) => any | Promise<any>) => {
    return asyncErrorHandler(async (req: express.Request, res: express.Response, next?: express.NextFunction) => {
        return handleResponse(ServiceResponse.json(await fn(req, res, next)), res);
    });
};
