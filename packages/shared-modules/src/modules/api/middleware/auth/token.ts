import { Request, Response, NextFunction } from "express";
import { AuthValidator } from "../../../../modules/Passworder";
import { Unauthenticated } from "@zerp/errors";

export const validateApiToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        const err = new Unauthenticated("Bad token value");

        if (!(token && token.length > 0)) throw err;
        const authRecord = await new AuthValidator().validateRequestAuthorizationToken(token);
        if (authRecord && authRecord.user) req.user = authRecord.user;
        next();
    } catch (e) {
        next(e);
    }
};
