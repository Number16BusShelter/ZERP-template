import * as http from "node:http";
import path from "path";
import cors from "cors";
import express from "express";
import compression from "compression";

import { app, logging, server as serverConfig } from "@zerp/global-configs";
import { AppLogger, createLogger } from "@zerp/utils";
import { AppConfig } from "@zerp/types";

// Setting global variables
import { globalRegistry, hidePath, reportError } from "./common";
import { generateDocsRouter } from "./routes/common/docs";
export const defaultLogger: AppLogger = createLogger({
    ...logging,
    name: app.name,
    service: app.service,
    subModule: "api",
});

global.globalRegistry = globalRegistry;
global.logger = globalRegistry;

function createBasicHttpServer(serverConfig: AppConfig, logger: AppLogger) {
// Classic Rest API server
    const app: express.Application = express();

    app.disable("x-powered-by");

// WS server
// const _app: express.Application = express();
// const { app, getWss, applyTo } = WebSocketExpress(_app);

    const iCors = cors({
        optionsSuccessStatus: 200,
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        origin: serverConfig.allowedOrigins,
    });
    app.use(iCors);
    app.use(express.json());

    app.options(/(.*)/, iCors);
    app.all(/(.*)/, function(req, res, next) {
        try {
            let originHost;
            try {
                originHost = req.headers["origin"]?.toLowerCase()
                    .replace("http\/\/", "")
                    .replace("https\/\/", "");
            } catch (e) {
                if (!(e instanceof TypeError)) throw e;
            }
            const origin = serverConfig.allowedOrigins.includes(originHost)
                ? originHost : serverConfig.domain;

            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        } catch (e) {
            logger.debug({
                error: e,
            });
        }
        next();
    });

    app.use(compression());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "/views"));

    app.get("/ping", (req, res) => {
        res.send("pong");
    });

    app.get("/bin", (req, res) => {
        console.log(req.query, req.body);
        res.send("ok");
    });

    app.use(reportError as express.ErrorRequestHandler);

    return app;
}


const port: number = parseInt(app.port) ?? 8080;
const host = "0.0.0.0";

let server: http.Server;

const startServer = async (expressApplication: express.Application, logger: AppLogger = defaultLogger): Promise<http.Server> => {
    // Adding documentation
    const docsPath = hidePath("/docs", serverConfig.secretRoute);
    expressApplication.use(docsPath, generateDocsRouter());

    logger.warn(`[?] Swagger UI has started http://0.0.0.0:${app.port}${docsPath}`);

    expressApplication.use(reportError as express.ErrorRequestHandler);

    logger.info(`> Starting Express HTTP server...`);
    server = expressApplication.listen(port, host, () => {
        logger.info(`Listening on host ${host} and port ${port} ...`);
        logger.info(`Running at ${app.handle}`);
    });
    return server;
};

const stopServer = async (server: http.Server, logger: AppLogger = defaultLogger): Promise<http.Server> => {
    logger.info("Gracefully shutting down server...");
    server = server.close();
    logger.info("Server shut down.");
    return server;
};

export {
    createBasicHttpServer,
    startServer,
    stopServer,
    defaultLogger as apiLogger,
};

