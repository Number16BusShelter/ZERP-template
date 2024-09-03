import { Worker } from "bullmq";

import { app, bull } from "@zerp/global-configs";
import { AppLogger, createLogger } from "@zerp/utils";

import BullBoard from "./bullBoard";
import BullModule from "./bullModule";
import { JobSetup, scripts as JobScripts } from "./handlers";
import * as http from "node:http";

async function startBullBoard(server: http.Server, path = bull.board?.uiBasePath, logger) {
    const bb = new BullBoard(bull, logger);
    const serverAdapter = bb.getBoardAdapter();
    // @ts-ignore
    server.use(path, serverAdapter.getRouter());

    return server.listen(app.port, () => {
        if (logger) logger.warn(`Bull Board has started http://0.0.0.0:${app.port}${bull.board?.uiBasePath} (${app.handle})`);
    });
}

let workerController: Worker;

const logger: AppLogger = createLogger({
    name: app.name,
    service: "bull",
    subModule: bull.masterControllerMode ? "master-worker" : "worker",
});

/**
 * Starts a BullMQ worker.
 * @returns {Promise<Worker>} The started worker instance.
 */
async function startWorker(): Promise<Worker> {
    workerController = await new BullModule(bull, logger).initWorker();
    if (logger) logger.info("> BullMQ worker has been started!");
    return workerController;
}

async function stopWorker(worker: Worker = workerController) {
    await worker.close();
    await worker.disconnect();
    logger.info("> BullMQ worker shut down.");
}

export {
    JobScripts,
    JobSetup,
    BullBoard,
    BullModule,
    startBullBoard,
    startWorker,
    stopWorker,
    Worker,
    logger as bullLogger,
};
