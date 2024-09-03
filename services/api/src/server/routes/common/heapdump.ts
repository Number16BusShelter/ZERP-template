import { logger } from "@/src/server/logger";
import { createHeapSnapshot } from "@/src/server/common/utils/heapdump";
import { hidePath } from "@/src/server/common/utils/hidePath";
import express, { Router } from "express";


/**
 * The URL path for accessing the heap dump route.
 *
 * @type {string}
 */
export const heapdumpPath: string = hidePath(`/heapdump`);

/**
 * Express route handler that triggers a heap dump and sends the resulting file to the client.
 *
 * Logs the start of heap dump profiling, creates a heap snapshot, and sends it to the client.
 * If an error occurs during snapshot creation or file transmission, an error is logged and a 500 status is returned.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
export const heapdumpRoute = (req: express.Request, res: express.Response) => {
    logger.warn(`Starting heapdump profiling...`);
    const heapdump = createHeapSnapshot();
    logger.info(`Heap snapshot written to ${heapdump}`);
    res.download(heapdump, (downloadErr) => {
        if (downloadErr) {
            logger.error("Error sending file:", downloadErr);
            res.status(500).send("Error sending file");
        } else {
            logger.info(`File sent: ${heapdump}`);
            logger.info(`Successfully finished heapdump profiling ${heapdump}`);
        }
    });
};

export default express.Router().get(heapdumpPath, heapdumpRoute);
