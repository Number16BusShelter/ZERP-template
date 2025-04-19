import swaggerJSDoc from "swagger-jsdoc";
import { swagger } from "@zerp/global-configs";
import { generateOpenAPIDocument } from "./openAPI";


export function combineSwaggerAndOpenAPIDocuments(): any {
    const swaggerDoc = swaggerJSDoc(swagger);
    const openApiDoc = generateOpenAPIDocument();

    // Merge the two OpenAPI documents
    return {
        ...swaggerDoc,
        paths: {
            ...openApiDoc.paths,
            ...swaggerDoc["paths"],
        },
        components: {
            ...swaggerDoc["components"],
            ...openApiDoc.components,
        },
        // You can merge other sections like `tags`, `security`, etc., similarly
    };
}

export const combinedSwaggerSpec = combineSwaggerAndOpenAPIDocuments();
export * from "./openAPI"
export * from "./swagger"
