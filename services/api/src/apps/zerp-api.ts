import { ApiApp, combineSwaggerAndOpenAPIDocuments } from "@zerp/shared-modules";
import { zerpApi } from "../server";


export class ZerpApi extends ApiApp {
    public async start() {
        return super.start(zerpApi)
    }

    public static combineSwaggerAndOpenAPIDocuments = combineSwaggerAndOpenAPIDocuments
}
