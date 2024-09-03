import fs from "fs";
import globalConfig from "@zerp/global-configs"
import config from "@/config"
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc(config.swagger);

export function createSwaggerFile() {
    fs.writeFileSync(`${globalConfig.app.rootDir}/docs/swagger.json`, JSON.stringify(swaggerSpec, null, 2))
}
