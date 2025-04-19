/*
* This file describes the way we define protected route
* */

// handler

import z from "zod";
import {
    ApiRequestDefinition, ApiResponseDefinition,
    asyncErrorHandler,
    createApiRequest,
    createApiResponse,
    globalRegistry,
    handleResponse, handlerWrapper, ServiceResponse, validateApiToken,
} from "@zerp/shared-modules";
import express from "express";
import { zodValidator } from "@zerp/shared-modules";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Unauthenticated } from "@zerp/errors";


const router = express.Router();

export const exampleRegistry = new OpenAPIRegistry();

const requestDefinition: ApiRequestDefinition = {
    headers: z.object({
        "Authorization": z.string(),
    })
};
const responseDefinitions: ApiResponseDefinition[] = [
    {
        description: "Authenticated",
        statusCode: 200,
        schema: z.object({}),
    },
    {
        description: "Unauthenticated",
        statusCode: 401,
        schema: z.object({}),
    },
];

const handler = async (req) => {
    if (!req.user) throw new Unauthenticated("User not authenticated!");
    return { status: "OK" }
};

exampleRegistry.registerComponent("securitySchemes", "apiKey", {
    type: "apiKey",
    in: "header",
    name: "Authorization"
});

exampleRegistry.registerPath({
    method: "post",
    path: "/example/authenticated",
    tags: ["Example"],
    security: [{
        apiKey: [],
    }],
    request: createApiRequest(requestDefinition),
    responses: createApiResponse(responseDefinitions),
});
router.post(
    "/",
    validateApiToken,
    zodValidator.validateRequest(requestDefinition),
    handlerWrapper(handler),
);

globalRegistry.push(exampleRegistry);

export default router;
