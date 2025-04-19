import { apiLogger } from "../../server";
import express from "express";
import { createHeapSnapshot, hidePath } from "../../common/utils";


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
    apiLogger.warn(`Starting heapdump profiling...`);
    const heapdump = createHeapSnapshot();
    apiLogger.info(`Heap snapshot written to ${heapdump}`);
    res.download(heapdump, (downloadErr) => {
        if (downloadErr) {
            apiLogger.error("Error sending file:", downloadErr);
            res.status(500).send("Error sending file");
        } else {
            apiLogger.info(`File sent: ${heapdump}`);
            apiLogger.info(`Successfully finished heapdump profiling ${heapdump}`);
        }
    });
};

const heapdump: express.Router = express.Router().get(heapdumpPath, heapdumpRoute);

export default heapdump
