import { app as appConfig } from "@zerp/global-configs";
import { AuthApi } from "@zerp/sdk/api";
import { expect } from "chai";

describe("API SDK test", async () => {
    let sdk;

    console.log(`Host api ${appConfig.handle}`);
    before(() => {
        sdk = new AuthApi({ basePath: "http://localhost:7070" });

    });
    it("should not register", async () => {
        try {
            await sdk.authRegisterPost({ firstName: "Johm" });
        } catch (e) {
            console.error(JSON.stringify(e.response.data, null, 2));
            // throw e;
        }
    });

    it("should register", async () => {
        try {
            await sdk.authRegisterPost({ firstName: "Johm" });
        } catch (e) {
            console.error(JSON.stringify(e.response.data, null, 2));
            // throw e;
        }
    });
});

