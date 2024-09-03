import { DataSource } from "typeorm";
import { Server } from "socket.io";
import * as http from "node:http";

import { DatabaseApp } from "@zerp/db";
import { createLogger } from "@zerp/utils";
import { AppsAvailable } from "@zerp/types";
import globalConfig, { logging } from "@zerp/global-configs";
import {
    ApiApp,
    IoApp,
    WorkerApp,
    Worker,
    GlobalAbstractContext,
} from "@zerp/shared-modules";

import zerpApi from "@/src/server";

const appEnabledConfig = ["db", "api", "worker", "io"];

const APPS_ENABLED: AppsAvailable[] = appEnabledConfig.map(ae => AppsAvailable[ae]);

export type ApiAppsMap = {
    [AppsAvailable.db]: typeof DatabaseApp,
    [AppsAvailable.api]: typeof ApiApp,
    [AppsAvailable.worker]: typeof WorkerApp
    [AppsAvailable.io]: typeof IoApp,
};

const APPS_MAP: ApiAppsMap = {
    [AppsAvailable.db]: DatabaseApp,
    [AppsAvailable.api]: ApiApp,
    [AppsAvailable.worker]: WorkerApp,
    [AppsAvailable.io]: IoApp,
};

const SHUTDOWN_ON_ERROR_ENABLED = !(globalConfig.app.mode == "production");

const logger = createLogger(logging);

logger.info(`> Warming up ${globalConfig.app.service} service...`);

/**
 * Represents the global context for the API service.
 * Manages the lifecycle of various application components and provides access to shared resources.
 */
export class ApiServiceGlobalContext extends GlobalAbstractContext {
    public dataSource: DataSource;
    public io: Server;
    public worker: Worker;
    public server: http.Server;

    public shutdownOnErrorEnabled = SHUTDOWN_ON_ERROR_ENABLED;
    public appsMap = APPS_MAP;

    constructor() {
        super({
            appsMap: APPS_MAP,
            globalConfig,
            appsEnabled: APPS_ENABLED,
            globalLogger: logger,
        });
    }

    public async startUp() {
        const dbApp = this.getApp<DatabaseApp>(AppsAvailable.db);
        this.dataSource = await dbApp.start();

        const appApp = this.getApp<ApiApp>(AppsAvailable.api);
        this.server = await appApp.start(zerpApi);

        const workerApp = this.getApp<WorkerApp>(AppsAvailable.worker);
        this.worker = await workerApp.start();

        const ioApp = this.getApp<IoApp>(AppsAvailable.io);
        this.io = await ioApp.start(this.server);

    }

    public async shutDown() {
        await this.getApp<IoApp>(AppsAvailable.io).stop();

        await this.getApp<WorkerApp>(AppsAvailable.worker).stop();

        await this.getApp<ApiApp>(AppsAvailable.api).stop();

        await this.getApp<DatabaseApp>(AppsAvailable.db).stop();
    }
}

const main = async () => {
    return new ApiServiceGlobalContext().boot();
};

(async () => {
    return main();
})();

