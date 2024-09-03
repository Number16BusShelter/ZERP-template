import "reflect-metadata";

import configs, { isProd } from "@zerp/global-configs";
import { createLogger, AppLogger } from "@zerp/utils";

import { DataSource, DataSourceOptions, EntityManager } from "typeorm";

import * as entities from "./entities";
import { QueryLogger } from "./query-logger";
const entitiesList = Object.keys(entities).map(key => entities[key]);

const dbConfig = configs.db as any;
const dbPort: number = Number(dbConfig!.port);


let logger: AppLogger = createLogger({
    name: configs.app.name,
    level: "info",
    subModule: "db",
});


const typeORMOptions: DataSourceOptions = {
    type: "postgres",
    schema: "public",
    // driver: "pg",
    host: dbConfig?.host!,
    port: dbPort,
    username: dbConfig?.username!,
    password: dbConfig?.password!,
    database: dbConfig?.database!,
    synchronize: dbConfig?.synchronize,
    // ===== For Debug uncomment =====
    // logging: ['query', 'warn'],
    // ===== And comment out this ====
    logging: true,
    logger: new QueryLogger(logger),
    // ===============================
    entities: entitiesList,
    //     [__dirname + "/entities/**/*.{js,ts}"],
    ssl: dbConfig?.ssl ? {
        rejectUnauthorized: false,
    } : false,
    migrations: [__dirname + "/migration/**/*.{js,ts}"],
    subscribers: [],
    extra: {
        max: 30000,
        connectionTimeoutMillis: 4000,
    },
    poolSize: 64,
    // @ts-ignore
    ...(isProd ? {cache: dbConfig?.cache} : {}),
};

let AppDataSource = new DataSource(typeORMOptions);
export const entityManager = new EntityManager(AppDataSource)

export async function runMigrations() {
    try {
        logger.info("> Starting migration...");
        await dsInit();
        const result = await AppDataSource.runMigrations();
        logger.info(JSON.stringify(result, null, 2));
        logger.info("Migration complete");
        return result;
    } catch (e) {
        logger.error(` Error encountered during migration:\n${e}`);
    }
}

export const dsInit = async (): Promise<DataSource> => {
    await AppDataSource.initialize();
    logger.info("> DataSource initialized!");
    return AppDataSource;
};


export const dsStop = async (dataSource: DataSource = AppDataSource) => {
    await dataSource.destroy();
    logger.info("DataSource connection closed!");
};

export default AppDataSource;
export {
    logger
}

