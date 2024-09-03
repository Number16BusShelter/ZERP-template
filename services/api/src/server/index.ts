import express from "express";

import { BullBoard, createBasicHttpServer } from "@zerp/shared-modules";
import { app, bull, app as appConfig } from "@zerp/global-configs";

import { logger } from "./logger";

import tonConnect from "./routes/tonConnect";
import authRoutes from "./routes/auth";
import docsRoutes from "./routes/common/docs";
import { reportError } from "@/src/server/common/http-handlers/handlers";
import { hidePath } from "@/src/server/common/utils/hidePath";
import { server as serverConfig } from "@/config";


const zerpApi = createBasicHttpServer(app, logger);


zerpApi.use("/auth", authRoutes);
zerpApi.use("/ton-connect", tonConnect);

// Add BullBoard to the app
const bullBoardPath = hidePath(bull.board.uiBasePath);
zerpApi.use(bullBoardPath, new BullBoard({
    ...bull,
    board: { ...bull.board, uiBasePath: bullBoardPath },
}).getBoardAdapter().getRouter());
logger.warn(`[?] Bull Board has started http://0.0.0.0:${appConfig.port}${bullBoardPath}`);

// Adding documentation
const docsPath = hidePath("/docs", serverConfig.secretRoute);
zerpApi.use(docsPath, docsRoutes)
logger.warn(`[?] Swagger UI has started http://0.0.0.0:${appConfig.port}${docsPath}`);

zerpApi.use(reportError as express.ErrorRequestHandler);

export default zerpApi;

export {
    zerpApi,
};
