import * as http from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import { SocketIOConfig } from "@zerp/types";
import { AppLogger, createLogger } from "@zerp/utils";
import globalConfig, { app, redis, rules, socketio, logging } from "@zerp/global-configs";

import { createRedisConnection } from "../redis";

const logger: AppLogger = createLogger({ ...logging, subModule: "redis-io" });

const createRedisSocketIOAdapter = () => {
    logger.info(`> Creating Redis socket io adapter`);
    if (!(redis.single.host && redis.single.port)) throw new Error("Failed to create Redis socket io adapter");
    const options = {
        host: redis.single.host,
        port: redis.single.port,
        ...(redis.password ? { password: redis.password! } : {}),
    };
    const pubClient = createRedisConnection(options);
    const subClient = pubClient.duplicate();
    return createAdapter(pubClient, subClient);
};


/**
 * Creates and configures a Socket.IO server, optionally on top of an existing HTTP server.
 * If no server is provided, it creates a standalone Socket.IO server.
 *
 * @param {HttpServer} [server] - The HTTP server to bind to.
 * @param {Object} [config=socketio] - Configuration for the Socket.IO server.
 * @returns {Server} The configured Socket.IO server instance.
 */
const createIOServer = (server?: http.Server, config: SocketIOConfig = socketio): Server => {
    // Create a Redis adapter for Socket.IO.
    const redisAdapter = createRedisSocketIOAdapter();
    const options = {
        adapter: redisAdapter,
        ...config,
    };

    // Log server configuration based on the presence of an HTTP server or specific port settings.
    if (server) {
        logger.warn(`Running IO server on top of express context ${app.handle}`);
    } else if (!config.port) {
        rules.REQ("SOCKETIO_PORT"); // Ensure the port is required if not set
    } else {
        logger.warn(`Running separate IO server at 0.0.0.0:${config.port}`);
    }

    let io: Server;

    if (!!server) {
        io = new Server(server, options);
    } else {
        io = new Server(options);
    }

    // CORS hardfix
    if (io.engine) io.engine.on("headers", (headers, req) => {
        try {
            let originHost;
            try {
                originHost = req.headers["origin"].toLowerCase();
            } catch (e) {
                if (!(e instanceof TypeError)) throw e;
            }
            const origin = globalConfig.app.allowedOrigins.includes(originHost)
                ? originHost : globalConfig.app.domain;
            headers["Access-Control-Allow-Origin"] = origin;
            headers["Access-Control-Allow-Credentials"] = "true";
            headers["Access-Control-Allow-Methods"] = "PUT, GET, POST, DELETE, OPTIONS";
            headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
        } catch (e) {
            logger.error({
                error: e,
            });
        }
    });

    // Initialize the Socket.IO server with or without an HTTP server.

    // Start listening on the specified port, if configured.
    if (config.port) {
        io.listen(config.port);
    }

    // Log the successful start of the server.
    logger.info(`> Socket.io server started at ws://${app.host}:${config.port ?? app.port}`);

    return io;
};


const shutdownIO = (io: Server) => {
    return io.close(() => {
        logger.info("Socket.io server is no longer accepting new connections");

        // Notify connected clients about the shutdown
        io.emit("serverShutdown");

        // Close client connections gracefully
        io.sockets.sockets.forEach((socket) => {
            socket.emit("serverShutdown");
            socket.disconnect(true); // Forceful disconnect
        });

        logger.info("Waiting for all connections to close...");

        // Wait for a brief period for connections to close
        setTimeout(() => {
            logger.warn("Forcefully disconnecting remaining clients...");
            io.close(); // Close the Socket.io server instance
        }, 5000); // 5 seconds

        logger.info("Socket.io server shut down");
    });
};

export {
    createRedisSocketIOAdapter,
    createIOServer,
    shutdownIO,
    logger as ioLogger,
};
