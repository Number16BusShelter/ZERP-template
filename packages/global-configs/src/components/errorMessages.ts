export default {
    APP_HOST: "App host must be provided! (Check if APP_HOST is provided in env variables)",
    APP_PORT: "App port must be provided! (Check if APP_PORT is provided in env variables)",
    APP_DOMAIN: "App domain must be provided! (Check if APP_DOMAIN is provided in env variables)",
    MEDIA_HOST: "Media host must be provided! (Check if MEDIA_HOST is provided in env variables)",
    GRAPH_NODE_HOST: "Graph node host must be provided! (Check if GRAPH_NODE_HOST is provided in env variables)",
    GRAPH_NODE_PORT: "Graph node port must be provided! (Check if GRAPH_NODE_PORT is provided in env variables)",
    GRAPH_NODE_KEY: "Graph node key must be provided! (Check if GRAPH_NODE_KEY is provided in env variables)",
    GRAPH_NODE_QUERY_API_URL: "Graph node query API URL must be provided! (Check if GRAPH_NODE_QUERY_API_URL is provided in env variables)",
    POSTGRES_USER: "Postgres user must be provided! (Check if POSTGRES_USER is provided in env variables)",
    POSTGRES_PASSWORD: "Postgres password must be provided! (Check if POSTGRES_PASSWORD is provided in env variables)",
    POSTGRES_HOST: "Postgres host must be provided! (Check if POSTGRES_HOST is provided in env variables)",
    POSTGRES_PORT: "Postgres port must be provided! (Check if POSTGRES_PORT is provided in env variables)",
    POSTGRES_DB: "Postgres driver must be provided! (Check if POSTGRES_DB is provided in env variables)",
    EVM_PLG_PROD_MANAGER_ADDRESS: "EVM (Polygon) manager address must be provided!",
    EVM_PLG_PROD_MANAGER_PRIV_KEY: "EVM (Polygon) manager key must be provided!",
    EVM_PLG_PROD_OWNER_ADDRESS: "EVM (Polygon) owner address must be provided!",
    EVM_PLG_PROD_OWNER_PRIV_KEY: "EVM (Polygon) owner key must be provided!",
    IPFS_HOST: "IPFS host must be provided!",
    IPFS_PORT: "IPFS port must be provided!",
    GEAR_SALE_STATUS_ERROR: "Provide sale status for running in production",
    GEAR_TESTNET_STATUS_ERROR: "Provide testnet/mainnet mode for running in production",
    RABBITMQ_DEFAULT_USER_ERROR: "Queue user environment variable should be provided",
    RABBITMQ_DEFAULT_PASS_ERROR: "Queue pass environment variable should be provided",
    RABBITMQ_DEFAULT_HOST_ERROR: "Queue host environment variable should be provided",
    RABBITMQ_DEFAULT_PORT_ERROR: "Queue port environment variable should be provided",
    APP_HOST_NOT_PROVIDED: "APP_HOST should be provided",
    EVM_PROD_PRIV_KEY: "EVM private key should be provided",
    EVM_PROD_ADDRESS: "EVM address should be provided",
    TRON_PROD_PRIV_KEY: "TRON private key should be provided",
    TRON_PROD_ADDRESS: "TRON address should be provided",
    REDIS_PASS_ERROR: "Redis pass environment variable should be provided",
    REDIS_HOST_ERROR: "Redis host environment variable should be provided",
    REDIS_PORT_ERROR: "Redis port environment variable should be provided",
    JWT_SECRET_KEY_ERROR: "JWT secret key should be provided",
    TWITTER_CONSUMER_KEY: "TWITTER_CONSUMER_KEY should be provided",
    TWITTER_CONSUMER_SECRET: "TWITTER_CONSUMER_SECRET should be provided",
    TWITTER_ACCESS_TOKEN: "TWITTER_ACCESS_TOKEN should be provided",
    TWITTER_TOKEN_SECRET: "TWITTER_TOKEN_SECRET should be provided",

};

class EnvironmentVariableNotProvidedError extends Error {
    constructor(variableName: string, appMode?: string) {
        const message = `Environment variable ${variableName} should be provided in ${appMode ?? process.env.NODE_ENV} mode.
        (Check if ${variableName} is provided in env variables)`;
        super(message);
        Object.setPrototypeOf(this, EnvironmentVariableNotProvidedError.prototype);
    }
}

function envVariableNotProvided(variableName: string) {
    throw new EnvironmentVariableNotProvidedError(variableName);
}

export {
    EnvironmentVariableNotProvidedError,
    envVariableNotProvided
}
