import { JobsOptions } from "bullmq";

import {
    exampleHandler
} from "./scripts";

interface IJobSetup {
    name: string;
    data?: any;
    options?: JobsOptions;
    handler: Function;
}

class JobSetup implements IJobSetup {
    name: string;
    data?: any;
    options?: JobsOptions;
    handler: Function;
}

export const jobs: Record<string, JobSetup> = {
    unbanUsers: {
        name: "exampleHandler",
        handler: exampleHandler,
        options: {
            priority: 2, // 1 is the biggest priority
            repeat: {
                pattern: "5 * * * *",
            },
            attempts: 3,
            backoff: {
                type: "exponential", // Backoff type, which can be either `fixed` or `exponential`.
                delay: 30000, // Backoff delay, in milliseconds.
            },
        },
    },

};

export { JobSetup };
export default jobs;
