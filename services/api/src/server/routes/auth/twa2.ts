import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";

import { JWTTokenSchema, WebAppInitDataSchema } from "@/src/server/middleware/validation/zod/schemas/twa";
import { createApiResponse, globalRegistry } from "@/src/server/common/api-docs/openAPI";
import { issueJWTToken } from "@/src/server/routes/auth/passport";
import { validateRequest } from "@/src/server/middleware/validation/zod";

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

twaAuthRouter.post("/", validateRequest(WebAppInitDataSchema), issueJWTToken);

export default twaAuthRouter;
