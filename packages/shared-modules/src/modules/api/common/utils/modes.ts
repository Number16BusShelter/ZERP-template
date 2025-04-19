import { app } from "@zerp/global-configs";

export const devModeOnly = (req, res, next) => {
    if (app.mode == "development") {
        return next();
    }
    throw new Error("No Allowed Mode");
};
