import { z, ZodError, ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";
import { ServerError } from "@zerp/errors";
import { handleResponse, processServerError, ServiceResponse } from "../../../common/http-handlers";
import { getMetadataArgsStorage } from "typeorm";
import "reflect-metadata";
import { ApiRequestDefinition } from "../../../common/api-docs/openAPI";

export type ValidateRequestOptions = ZodSchema | ApiRequestDefinition

// Backward-compatible validation middleware
export const validateRequest = (schemaOrOptions: ValidateRequestOptions) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (schemaOrOptions instanceof ZodSchema) {
            // Backward-compatible case: Single schema for body, query, and params
            schemaOrOptions.parse({
                body: req.body,
                query: req.query,
                params: req.params,
                headers: req.headers,
                coolies: req.cookies,
            });
        } else {
            // New case: Separate schemas for body, query, and params
            if (schemaOrOptions.body) {
                await schemaOrOptions.body.parseAsync(req.body);
            }
            if (schemaOrOptions.query) {
                await schemaOrOptions.query.parseAsync(req.query);
            }
            if (schemaOrOptions.params) {
                await schemaOrOptions.params.parseAsync(req.params);
            }
            if (schemaOrOptions.headers) {
                await schemaOrOptions.headers.parseAsync(req.headers);
            }
            if (schemaOrOptions.cookies) {
                await schemaOrOptions.cookies.parseAsync(req.cookies);
            }
        }
        next(); // Proceed if validation passes
    } catch (err: any | ServerError) {
        // Error handling
        const errorMessage = `Invalid input: ${(err as ZodError)
            .errors
            .map((e) => `${e.path.join(".")} ${e.message} (${e.code})`)
            .join(", ")}`;

        const statusCode = 400;

        // Optionally
        processServerError(err);

        const serviceResponse = ServiceResponse.error({
            code: err?.code ?? statusCode,
            statusCode: err?.httpCode ?? statusCode,
            message: errorMessage,
            errors: (err as ZodError).errors,
        });

        handleResponse(serviceResponse, res);
    }
};

const typeormToZodMap: Record<string, any> = {
    string: z.string,
    number: z.number,
    boolean: z.boolean,
    date: z.date,
    uuid: z.string,
    object: z.object,
    // "decimal": (precision: number, scale: number) => z.number().refine((value) => parseFloat(value.toFixed(scale))),
};

export function generateZodSchemaFromTypeOrmEntity(entityClass: any) {
    const columns = getMetadataArgsStorage().columns.filter((col) => col.target === entityClass);
    const relations = getMetadataArgsStorage().relations.filter((rel) => rel.target === entityClass);

    const zodObject: Record<string, any> = {};

    for (const column of columns) {
        const columnType = Reflect.getMetadata("design:type", entityClass.prototype, column.propertyName).name.toLowerCase();

        if (typeormToZodMap[columnType]) {
            if (column.options.nullable) {
                zodObject[column.propertyName] = typeormToZodMap[columnType]().nullable();
            } else {
                zodObject[column.propertyName] = typeormToZodMap[columnType]();
            }
        }

        // Handling custom column types like decimal
        if (column.options.type === "decimal") {
            const precision = column.options.precision ?? 10;
            const scale = column.options.scale ?? 2;
            zodObject[column.propertyName] = z.number().refine(
                (value) => value.toFixed(scale).length <= precision,
                `Should have a maximum of ${precision} digits and ${scale} decimals`,
            );
        }
    }

    // Handle relations
    for (const relation of relations) {
        const relatedEntity = Reflect.getMetadata("design:type", entityClass.prototype, relation.propertyName);
        zodObject[relation.propertyName] = z.lazy(() => generateZodSchemaFromTypeOrmEntity(relatedEntity)); // Recursive generation
    }

    return z.object(zodObject);
}
