import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";

import { JWTTokenSchema, WebAppInitDataSchema } from "@/src/server/routes/auth/twa/twa.schema";
import { issueJWTToken } from "@zerp/shared-modules";
import { createApiResponse, globalRegistry, zodValidator } from "@zerp/shared-modules";

// Definitions
export const twaAuthRegistry = new OpenAPIRegistry();

twaAuthRegistry.register("WebAppInitDataSchema", WebAppInitDataSchema);
twaAuthRegistry.register("JWTTokenSchema", JWTTokenSchema);

twaAuthRegistry.registerPath({
    method: "post",
    path: "/auth/twa2",
    tags: ["MiniApp"],
    request: {
        query: WebAppInitDataSchema,
    },
    responses: createApiResponse({
        description: "Successful authentication. JWT token has been issued",
        statusCode: 200,
        schema: JWTTokenSchema,
    })

});
globalRegistry.push(twaAuthRegistry)

// Router
const twaAuthRouter: Router = express.Router();

twaAuthRouter.post("/", zodValidator.validateRequest(WebAppInitDataSchema), issueJWTToken);

export default twaAuthRouter;
