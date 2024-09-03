// Database configuration
import redis from "./redis"
import rules from "./rules";
import { isProd } from "./app";

export default {
    username: (process.env.POSTGRES_USER || rules.REQ("POSTGRES_USER")),
    password: (process.env.POSTGRES_PASSWORD || rules.REQ("POSTGRES_PASSWORD")),
    host: (process.env.POSTGRES_HOST || rules.REQ("POSTGRES_HOST")),
    port: (`${process.env.POSTGRES_PORT}` || rules.REQ("POSTGRES_PORT")),
    database: (process.env.POSTGRES_DB || rules.REQ("POSTGRES_DB")),
    dialect: "postgres",
    // Enabling this feature WILL BREAK MIGRATIONS !!!
    // NEVER SET TO true IN PRODUCTION
    synchronize: false,
    logging: false, // console.log,
    define: {
        freezeTableName: true,
    },
    debug: process.env.DB_DEBUG
        ? (process.env.DB_DEBUG.toLocaleLowerCase() === "true")
        : (process.env.NODE_ENV != "production"),
    ...(process.env.POSTGRES_USE_SSL ?  { ssl: (process.env.POSTGRES_USE_SSL.toLocaleLowerCase() == "true") } : {}),
    tableName: "db_cache",
    cache: {
        type: "redis",
        options: {
            socket: {
                host: redis.single.host!,
                port: redis.single.port!,
            },
            database: 8,
        },
        ignoreErrors: true
    }
};
