import express from "express";

import * as http from "node:http";
import { AppContext } from "@zerp/types";
import { AppLogger } from "@zerp/utils";

import { createBasicHttpServer, startServer, stopServer, apiLogger } from "../modules/api";

export class ApiApp extends AppContext {
    protected server: http.Server;
    protected logger: AppLogger = apiLogger;

    public async start(serverApp: express.Application) {
        this.server = await startServer(serverApp);
        return this.server;
    }

    public async stop() {
        if (!this.server) {
            this.logger.warn("Server has not been not started! Nothing to stop!");
            return;
        }
        return await stopServer(this.server);
    }

    public static createBasicHttpServer = createBasicHttpServer;
}
