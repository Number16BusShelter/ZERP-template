import fs from "fs";
import globalConfig from "@zerp/global-configs"
import {swagger} from "@zerp/global-configs"
import swaggerJSDoc from "swagger-jsdoc";
import { combineSwaggerAndOpenAPIDocuments } from "../api-docs";

export const swaggerSpec = swaggerJSDoc(swagger);

export const getSwaggerSpec = (swaggerConfig = swagger) => swaggerJSDoc(swaggerConfig);

export function createSwaggerFile(swaggerFile = combineSwaggerAndOpenAPIDocuments()) {
    const destination = `${globalConfig.app.rootDir}/docs/swagger.json`
    console.log(`Creating Swagger file from ${destination}`);
    fs.writeFileSync(destination, JSON.stringify(swaggerFile, null, 2))
}
