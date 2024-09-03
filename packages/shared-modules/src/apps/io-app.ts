import { AppContext } from "@zerp/types";
import { AppLogger } from "@zerp/utils";
import { Server } from "socket.io";
import { createIOServer, shutdownIO, ioLogger } from "../modules/redis";

import * as http from "node:http";

export class IoApp extends AppContext {
    protected logger: AppLogger = ioLogger;
    private io: Server;

    public async start(server?: http.Server): Promise<Server> {
        this.io = createIOServer(server);
        return this.io;
    }

    public async stop() {
        this.logger.info("Gracefully shutting down Socket.io server...");
        if (!this.io) {
            this.logger.warn("No Socket.io server to stop");
            return;
        }
        return shutdownIO(this.io);
    }
}
