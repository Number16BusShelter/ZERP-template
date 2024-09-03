import { runMigrations } from "@zerp/db";
import { contextRunner } from "@zerp/utils";

export default (async () => {
    await contextRunner(async () => {
            await runMigrations();
        },
        async () => {},
        undefined, true);
})();
