import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodSchema } from "zod";
import { handleResponse, ServiceResponse } from "@/src/server/common/http-handlers/serviceResponse";

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    const errorMessage = `Invalid input: ${(err as ZodError)
        .errors
        .map((e) => `${e.path} ${e.message} (${e.code})`)
        .join(", ")}`;
    const statusCode = 400;
    const serviceResponse = ServiceResponse.error({
      code: err.code ?? statusCode,
      statusCode: err.httpCode ?? statusCode,
      message: errorMessage,
      errors: (err as ZodError).errors,
    });

    return handleResponse(serviceResponse, res);
  }
};
