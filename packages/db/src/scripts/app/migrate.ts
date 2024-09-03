import { runMigrations } from "../../";
import { contextRunner } from "@zerp/utils";

export default (async () => {
    await contextRunner(async () => {
            await runMigrations();
        },
        async () => {
        }, undefined, true);
})();
