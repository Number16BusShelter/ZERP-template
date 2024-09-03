import {EnvironmentVariableNotProvidedError} from "./errorMessages";

const env: string = process.env.NODE_ENV ?? "development";

export const PROD_REQ = (message: string) => {
    if (env === "production") throw new Error(message);
};
export const TEST_REQ = (message: string) => {
    if (env === "test") throw new Error(message);
};
export const DEV_REQ = (message: string) => {
    if (env === "development") throw new Error(message);
};

export const REQ = (variableName: string): never => {
    throw new EnvironmentVariableNotProvidedError(variableName);
};

export const MUST = (variableName: string): never => {
    throw new EnvironmentVariableNotProvidedError(variableName);
};

export const PROD_REQ_EVNT = (variableName: string) => {
    if (env === "production") throw new EnvironmentVariableNotProvidedError(variableName);
};
export const TEST_REQ_EVNT = (variableName: string) => {
    if (env === "test") throw new EnvironmentVariableNotProvidedError(variableName);
};
export const DEV_REQ_EVNT = (variableName: string) => {
    if (env === "development") throw new EnvironmentVariableNotProvidedError(variableName);
};

export default {
    PROD_REQ,
    TEST_REQ,
    DEV_REQ,
    REQ,
    PROD_REQ_EVNT,
    TEST_REQ_EVNT,
    DEV_REQ_EVNT
}
