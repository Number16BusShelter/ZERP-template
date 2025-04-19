import express from "express";

import { BullBoard, createBasicHttpServer } from "@zerp/shared-modules";
import { app, bull, app as appConfig } from "@zerp/global-configs";

import { logger } from "./logger";

import tonConnect from "./routes/tonConnect";
import authRoutes from "./routes/auth";
import exampleRoutes from "./routes/example"
import { reportError, hidePath } from "@zerp/shared-modules"


const zerpApi = createBasicHttpServer(app, logger);


zerpApi.use("/auth", authRoutes);
zerpApi.use("/ton-connect", tonConnect);
zerpApi.use("/example", exampleRoutes)

// Add BullBoard to the app
const bullBoardPath = hidePath(bull.board.uiBasePath);
zerpApi.use(bullBoardPath, new BullBoard({
    ...bull,
    board: { ...bull.board, uiBasePath: bullBoardPath },
}).getBoardAdapter().getRouter());
logger.warn(`[?] Bull Board has started http://0.0.0.0:${appConfig.port}${bullBoardPath}`);

zerpApi.use(reportError as express.ErrorRequestHandler);

export default zerpApi;

export {
    zerpApi,
};
