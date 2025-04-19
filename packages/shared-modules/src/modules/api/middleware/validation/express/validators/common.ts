import { query } from "express-validator";

export const paginationValidations = [
    query("take")
        .optional()
        .default(10)
        .escape()
        .isNumeric()
        .customSanitizer((v) => parseInt(v)),
    query("page")
        .optional()
        .default(1)
        .escape()
        .isNumeric()
        .customSanitizer((v) => parseInt(v)),
    query("search").optional().escape(),
];

export function compose(middleware) {
    if (!middleware.length) {
        return function(_req, _res, next) {
            next();
        };
    }

    let head = middleware[0];
    let tail = middleware.slice(1);

    return function(req, res, next) {
        head(req, res, function(err) {
            if (err) return next(err);
            compose(tail)(req, res, next);
        });
    };
}

