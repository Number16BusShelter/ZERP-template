import { BullBoardConfig } from "@zerp/types"

import redis from "./redis";
import app from "./app";
import rules from "./rules";

// See https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue for more info

const masterControllerMode = (process.env.BULLMQ_MASTER_CONTROLLER_MODE
    || rules.REQ("BULLMQ_MASTER_CONTROLLER_MODE"))?.toLowerCase() == "true";

const initRepeatingJobs = (process.env.BULLMQ_INIT_REPEATING_JOBS
    || rules.REQ("BULLMQ_INIT_REPEATING_JOBS"))?.toLowerCase() == "true";

const resetRepeatingJobs = (process.env.BULLMQ_RESET_REPEATING_JOBS
    || rules.REQ("BULLMQ_RESET_REPEATING_JOBS"))?.toLowerCase() == "true";

const cleanStart = (process.env.BULLMQ_CLEAN_START
    || rules.REQ("BULLMQ_CLEAN_START"))?.toLowerCase() == "true";

const bullBoard: BullBoardConfig = {
    uiBasePath: '/queue/ui',
    uiConfig: {
        boardTitle: "My BOARD",
        boardLogo: {
            path: "https://cdn.my-domain.com/logo.png",
            width: "100px",
            height: 200,
        },
        miscLinks: [
            { text: "Logout", url: "/logout" }
        ],
        favIcon: {
            default: "static/images/logo.svg",
            alternative: "static/favicon-32x32.png",
        },
    },
};

const bull = {
    queueName: app.name,
    prefix: app.name,
    board: bullBoard,
    defaultOptions: {
        connection: {
            host: redis.single.host || "localhost",
            port: redis.single.port || 6379,
            ...(redis.password ? { password: redis.password! } : {}),
        }
    },
    /**
     *  Makes this worker master controller
     *  Use true when multiple workers are running
     *  */
    masterControllerMode: masterControllerMode,
    /**
     * Initializes repeating jobs
     * */
    initRepeatingJobs: initRepeatingJobs,
    /**
     * Resets repeating jobs
     * Use when job schedule has been changed
     * */
    resetRepeatingJobs: resetRepeatingJobs,
    /**
     * Resets all jobs present in queue
     * */
    cleanStart: cleanStart,
    // See https://blog.logrocket.com/asynchronous-task-processing-in-node-js-with-bull/
    // defaultJobOptions: {},
    // limiter: {}
};

export default bull
