import { SessionsConfig } from "@zerp/types"
import { generateRandomString } from "@zerp/utils";
import { plainToInstance, Type } from "class-transformer";

export default plainToInstance(SessionsConfig, {
    secret: (process.env.SESSION_SECRET ?? generateRandomString(64)),
    cleanupLimit: 2,
    limitSubquery: false, // If using MariaDB.
    ttl: 86400,
})
