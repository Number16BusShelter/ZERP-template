import { ServerResponse } from "@zerp/types";
import { ContextRunner, ValidationChain, validationResult } from "express-validator";

import { Middleware } from "express-validator/lib/base";
import { routesToValidatorsMap } from "@/src/server/middleware/validation/express/map";
import { handleResponse } from "@/src/server/common/http-handlers/serviceResponse";

type ValidationKeys = keyof typeof routesToValidatorsMap;

type ValidationMap = {
    [key in ValidationKeys]: ValidationChain[] | (Middleware & ContextRunner)[]
}

const routesToValidators: ValidationMap = routesToValidatorsMap;


export function createValidationFor(route: ValidationKeys) {
    const validator = routesToValidators[route];
    return validator || [];
}

export function createValidationsFor(...routes: ValidationKeys[]) {
    return routes.map(route => createValidationFor(route)).flat();
}

export function checkValidationResult(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }

    const resp: ServerResponse = {
        success: false,
        code: 422,
        statusCode: 422,
        message: "Parameter validation error",
        errors: result.array(),
    };

    return handleResponse(resp, res)
}

export function validateRequest(route: ValidationKeys) {
    return [
        createValidationFor(route),
        checkValidationResult,
    ];
}
