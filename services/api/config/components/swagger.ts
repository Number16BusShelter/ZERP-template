import { app } from "@zerp/global-configs";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "ZERP backend",
        version: "0.0.1",
        description: "API documentation for ZERP API backend",
        contact: {
            name: "Clicker bot backend",
            email: "",
        },
    },
    host: app!.host == "localhost" ? `${app!.host}:${app!.port}` : `${app!.host}`,
    basePath: "/",
    externalDocs: {
        description: "View the raw OpenAPI Specification in JSON format",
        url: "/swagger.json",
    },
};

const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ["./src/server/**/*.ts", "./src/server/**/*.js", "./**/dist/**/*.js"],

};

export default options;
