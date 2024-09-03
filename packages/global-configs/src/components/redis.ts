import ErrorMessages from "./errorMessages";
import rules from "./rules";

function getClusterNodes(connectionPool): object[] {
    return (connectionPool ?? []).map((cp) => {
        const connectionRegex =
            /^(?:([^:/?#\s]+):\/\/)?(?:([^@/?#\s]+)@)?([^:/?#\s]+)(?::(\d+))?(?:\/(\d+))?$/;
        const match = cp.match(connectionRegex);

        if (!match) {
            throw new Error(`Invalid connection string: ${cp}`);
        }
        const [, , authMatch, hostMatch, portStrMatch, dbStrMatch] = match;
        const host = hostMatch;
        const port = parseInt(portStrMatch || "6379", 10);
        const db = parseInt(
            dbStrMatch ?? "0",
            10,
        );
        const [username, password] = authMatch
            ? authMatch.split(":")
            : [];

        return {
            host: host,
            port: port,
            db: db,
            ...(username && username.length > 0
                ? { username: username }
                : {}),
            ...(password && password.length > 0
                ? { password: password }
                : {}),
            connectTimeout: 30 * 60 * 1000,
        };
    });
}

const redisMode = process.env.REDIS_MODE ?? "single"

const getConnectionPull = (value: string): string[] => {
    return value.split(",").map((a: string) => a.trim());
};

const getRedisConnectionPool = (): string[] => {
    let pool;
    if (redisMode == "cluster") {
        pool = (process.env["REDIS_CONNECTION_POOL"] && process.env["REDIS_CONNECTION_POOL"].length > 0)
            ? getConnectionPull(<string>process.env["REDIS_CONNECTION_POOL"])
            : process.env.REDIS_URL
                ? <string[]>[process.env.REDIS_URL]
                : [];
        if (pool.length == 0)
            throw new Error("Redis IO pool connection was not provided!");
    }
    return pool;
};

const pool = getRedisConnectionPool()

export default {
    mode: redisMode,
    password: process.env.REDIS_PASSWORD ?? 'nopass',
    single: {
        host: process.env.REDIS_HOST! || rules.PROD_REQ(ErrorMessages.REDIS_HOST_ERROR),
        port: parseInt(process.env.REDIS_PORT!) || rules.PROD_REQ(ErrorMessages.REDIS_PORT_ERROR),
    },
    cluster: {
        pool,
        nodes: getClusterNodes(pool)
    },
};

