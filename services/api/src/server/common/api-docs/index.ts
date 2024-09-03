import swaggerJSDoc from "swagger-jsdoc";
import config from "@/config";
import { generateOpenAPIDocument } from "@/src/server/common/api-docs/openAPI";


export function combineSwaggerAndOpenAPIDocuments(): any {
    const swaggerDoc = swaggerJSDoc(config.swagger);
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
