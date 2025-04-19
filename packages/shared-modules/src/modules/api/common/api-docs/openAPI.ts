import z, { ZodEffects, ZodSchema, type ZodType } from "zod";
import { ResponseConfig } from "@asteasolutions/zod-to-openapi";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { swagger } from "@zerp/global-configs";
import { ServiceResponseSchema } from "../http-handlers/serviceResponse";
import fs from "fs";
import globalConfig from "@zerp/global-configs";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { RouteParameter, ZodRequestBody } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";

extendZodWithOpenApi(z);

export type ApiResponseDefinition = {
    schema: z.ZodTypeAny;
    description: string;
    statusCode: number;
    headers?: { [header: string]: { description?: string; schema: z.ZodTypeAny } };
    links?: { [link: string]: { description?: string; operationId?: string; parameters?: { [key: string]: any } } };
    contentType?: string; // Default to 'application/json'
};

export type ApiRequestDefinition = {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
    headers?: ZodSchema;
    cookies?: ZodSchema;
};

export const globalRegistry: OpenAPIRegistry[] = [];

export function generateOpenAPIDocument(swaggerDefinition = swagger.swaggerDefinition): any {
    const registry = new OpenAPIRegistry(globalRegistry);
    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument(swaggerDefinition);
}

export function createApiRequest(definition: ApiRequestDefinition): {
    body?: ZodRequestBody;
    params?: RouteParameter;
    query?: RouteParameter;
    cookies?: RouteParameter;
    headers?: RouteParameter;
} {
    // Convert request definition to OpenAPI parameters
    return {
        query: definition.query as RouteParameter,
        params: definition.params as RouteParameter,
        headers: definition.headers as RouteParameter,
        body: definition.body ? {
            content: {
                "application/json": { schema: definition.body },
            },
        } : undefined,
    };
}

export function createApiResponseDefinition(config: ApiResponseDefinition) {
    return {
        description: config.description,
        content: {
            "application/json": {
                schema: ServiceResponseSchema({
                    dataSchema: config.schema,
                    success: config.statusCode < 400,
                    statsCode: config.statusCode,
                }).openapi({
                    description: config.description,

                }),
            },
        },

    };
}

export function createApiResponses(configs: ApiResponseDefinition[]) {
    const responses: { [key: string]: ResponseConfig } = {};

    configs.forEach((config) => {
        responses[config.statusCode] = createApiResponseDefinition(config);
    });


    return responses;
}

export function createApiResponse(config: ApiResponseDefinition[] | ApiResponseDefinition) {
    if (Array.isArray(config)) {
        return createApiResponses(config);
    }
    return {
        [config.statusCode]: createApiResponseDefinition(config),
    };
}

export function createOpenApiFile() {
    fs.writeFileSync(`${globalConfig.app.rootDir}/docs/swagger.json`, JSON.stringify(generateOpenAPIDocument(), null, 2));
}

