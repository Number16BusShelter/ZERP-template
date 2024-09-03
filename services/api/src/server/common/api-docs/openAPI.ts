import z from "zod";
import config from "@/config";
import { ResponseConfig } from "@asteasolutions/zod-to-openapi";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { ServiceResponseSchema } from "@/src/server/common/http-handlers/serviceResponse";
import fs from "fs";
import globalConfig from "@zerp/global-configs";
import { swaggerSpec } from "@/src/server/common/api-docs/swagger";

export type ApiResponseConfig = {
    schema: z.ZodTypeAny;
    description: string;
    statusCode: number;
    headers?: { [header: string]: { description?: string; schema: z.ZodTypeAny } };
    links?: { [link: string]: { description?: string; operationId?: string; parameters?: { [key: string]: any } } };
    contentType?: string; // Default to 'application/json'
};

export const globalRegistry: OpenAPIRegistry[] = [];

export function generateOpenAPIDocument(): any {
    const registry = new OpenAPIRegistry(globalRegistry);
    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument(config.swagger.swaggerDefinition);
}


export function createApiResponseDefinition(config: ApiResponseConfig) {
    return {
        description: config.description,
        content: {
            "application/json": {
                schema: ServiceResponseSchema(config.schema),
            },
        },

    };
}

export function createApiResponse(config: ApiResponseConfig) {
    return {
        [config.statusCode]: createApiResponseDefinition(config),
    };
}

export function createApiResponses(configs: ApiResponseConfig[]) {
    const responses: { [key: string]: ResponseConfig } = {};

    configs.forEach((config) => {
        responses[config.statusCode] = createApiResponseDefinition(config);
    });

    return responses;
}

export function createOpenApiFile() {
    fs.writeFileSync(`${globalConfig.app.rootDir}/docs/swagger.json`, JSON.stringify(generateOpenAPIDocument(), null, 2))
}

