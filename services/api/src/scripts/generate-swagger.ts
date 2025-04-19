import { ZerpApi } from "../apps/zerp-api";
import { createSwaggerFile } from "@zerp/shared-modules";

const main = async () => {
    createSwaggerFile(ZerpApi.combineSwaggerAndOpenAPIDocuments())
    process.exit(0)
}

(async () => main())()
