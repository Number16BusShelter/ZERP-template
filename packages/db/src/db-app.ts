import { AppLogger } from "@zerp/utils";
import { AppContext } from "@zerp/types"
import { DataSource } from "typeorm";
import AppDataSource, {
    dsInit,
    dsStop,
    logger
} from "./data-source";

export class DatabaseApp extends AppContext {
    private dataSource: DataSource = AppDataSource;
    protected logger: AppLogger = logger;

    public async start() {
        logger.info("> Initializing data source connection...");
        this.dataSource = await dsInit();
        return this.dataSource
    }

    public async stop() {
        if (!(this.dataSource && this.dataSource.isInitialized)) {
            this.logger.warn("No data source!");
            return;
        }
        logger.info("Gracefully shutting down data source connection...");
        await dsStop(this.dataSource);
    }
}
