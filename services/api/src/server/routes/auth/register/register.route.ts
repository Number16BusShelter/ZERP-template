import z from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express from "express";
import {
    ApiRequestDefinition,
    ApiResponseDefinition,
    createApiRequest,
    createApiResponse, globalRegistry, handlerWrapper,
    zodValidator,
} from "@zerp/shared-modules";
import {RegisterSchema} from "./register.schema"

const router = express.Router();

const registry = new OpenAPIRegistry();


const requestDefinition: ApiRequestDefinition = {
    body: RegisterSchema
};
const responseDefinitions: ApiResponseDefinition[] = [
    {
        description: "Registration complete",
        statusCode: 200,
        schema: z.object({}),
    },
    {
        description: "Validation failure",
        statusCode: 400,
        schema: z.object({
            statusCode: z.number().openapi({example: 1212}),
        }),
    },
    {
        description: "Forbidden",
        statusCode: 403,
        schema: z.object({}),
    },
];

const handler = async (req) => {
    const registrationData = RegisterSchema.safeParse(req.body).data
    console.log(`User has successfully registered in ${JSON.stringify(registrationData, null, 2)}`);
    return {success: true}
}

registry.register("RegisterRequest", RegisterSchema);

registry.registerPath({
    method: "post",
    path: "/auth/register",
    tags: ["Auth"],
    request: createApiRequest(requestDefinition),
    responses: createApiResponse(responseDefinitions),
});
router.post(
    "/",
    zodValidator.validateRequest(requestDefinition),
    handlerWrapper(handler),
);

globalRegistry.push(registry)


export default router
