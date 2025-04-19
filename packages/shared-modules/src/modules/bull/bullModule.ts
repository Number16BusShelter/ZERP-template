import { Queue, Worker, Job, Processor } from "bullmq";

import { bull } from "@zerp/global-configs";
import { BullBoardConfig } from "@zerp/types";
import { AppLogger, unwrapMapMember } from "@zerp/utils";

import { JobSetup, jobs } from "./handlers";
import { JobSchedulerJson, QueueOptions } from "bullmq/dist/esm/interfaces";

export interface BullConfig {
    defaultOptions: QueueOptions;
    board?: BullBoardConfig;
    queueName: string;
    masterControllerMode: boolean;
    initRepeatingJobs: boolean;
    resetRepeatingJobs: boolean;
    cleanStart: boolean;
    prefix: string;
}


/**
 * BullModule provides an abstraction over BullMQ functionalities,
 * including queue management, worker initialization, and task registration.
 */
export default class BullModule {
    private queueName: string;
    private queue: Queue;
    private tasks: Record<string, JobSetup> = {};

    // Worker config
    private worker!: Worker;
    private workerProcessor: Processor;

    private readonly masterMode: boolean;
    private readonly initRepeatingJobsFlag: boolean;
    private readonly resetRepeatingJobsFlag: boolean;
    private readonly cleanStart: boolean;


    /**
     * Initializes the BullModule with configuration and task specifications.
     * @param {BullConfig} config - Configuration for BullMQ.
     * @param {JobSetup[]} taskSpecs - List of job setups to be registered.
     * @param logger
     */
    constructor(
        private readonly config: BullConfig = bull,
        private readonly logger: AppLogger,
        private readonly taskSpecs: JobSetup[] = Object.values(jobs),
    ) {
        // Worker configuration
        this.masterMode = config.masterControllerMode;
        this.initRepeatingJobsFlag = config.initRepeatingJobs;
        this.resetRepeatingJobsFlag = config.resetRepeatingJobs;
        this.cleanStart = config.cleanStart;

        this.queueName = config.queueName;
        this.logger.info("Initializing Queue...");
        this.queue = BullModule.createQueue(this.queueName, this.config.defaultOptions);
        this.logger.info(`Registering tasks: ${taskSpecs.map(t => t.name).join(", ")}`);
        this.registerTasks(taskSpecs);
    }

    /**
     * Creates a BullMQ Queue with the given name and options.
     * @param {string} name - The name of the queue.
     * @param {QueueOptions} [options] - Optional Queue options.
     * @returns {Queue} The created queue.
     */
    private static createQueue(name: string, options?: QueueOptions): Queue {
        return new Queue(name, options);
    }

    public static getDefaultQueue(): Queue {
        return BullModule.createQueue(bull.queueName, bull.defaultOptions);
    }

    /**
     * Adds a task to the queue.
     * @param {JobSetup} task - The task setup to be added.
     * @param {Queue} queue - The queue to which the task is added.
     */
    public static async addTask(task: JobSetup | Omit<JobSetup, "handler">, queue: Queue = BullModule.getDefaultQueue()): Promise<Job> {
        const defaultJobSetup = jobs[task.name];
        const {
            name,
            data = defaultJobSetup.data ?? {},
            options = defaultJobSetup.options ?? {},
        } = task;
        return await queue.add(name, data, options);
    }

    /**
     * Adds a task to the queue. The task can be a JobSetup object or the name of a task.
     * @param {JobSetup | string} task - The task to add.
     * @returns {Promise<void>}
     */
    public async addTask(task: JobSetup | string): Promise<Job> {
        const taskSetup = task instanceof JobSetup ? task : unwrapMapMember(jobs, task);
        return BullModule.addTask(taskSetup, this.queue);
    }

    /**
     * Sets the queue name and reinitializes the queue with the new name.
     * @param {string} queueName - The new queue name.
     */
    public setQueueName(queueName: string): void {
        this.queueName = queueName;
        this.queue = BullModule.createQueue(queueName, this.config.defaultOptions);
    }

    /**
     * Initializes and starts the worker.
     * @returns {Promise<Worker>} The initialized worker.
     */
    public async initWorker(): Promise<Worker> {
        this.logger.info("> Initializing Worker...");
        this.logger.info(`Worker is running in '${this.masterMode ? "master" : "worker"}' mode`);
        this.logger.info(`Repeating jobs initialization is '${this.initRepeatingJobsFlag ? "enabled" : "disabled"}'`);
        this.logger.info(`Repeating jobs reset is '${this.resetRepeatingJobsFlag ? "enabled" : "disabled"}'`);
        this.logger.info(`Clean start is '${this.cleanStart ? "enabled" : "disabled"}'`);

        if (this.masterMode) {
            await this.handleMasterMode();
        }

        this.initializeWorkerProcessor();
        this.worker = new Worker(this.queueName, this.workerProcessor, this.config.defaultOptions);

        return this.worker;
    }

    /**
     * Handles initialization steps for the master mode, including cleaning,
     * resetting, and initializing repeating jobs.
     */
    private async handleMasterMode(): Promise<void> {
        if (this.cleanStart) {
            await this.cleanQueue();
        }
        if (this.resetRepeatingJobsFlag) {
            await this.resetRepeatingJobs();
        }
        if (this.initRepeatingJobsFlag && !this.resetRepeatingJobsFlag) {
            this.logger.info("> Initializing repeating jobs...");
            await this.initializeRepeatingJobs();
        }
    }

    /**
     * Registers the provided tasks.
     * @param {JobSetup[]} jobs - Array of job setups to be registered.
     */
    private registerTasks(jobs: JobSetup[]): void {
        for (const job of jobs) {
            this.tasks[job.name] = job;
        }
    }

    /**
     * Initializes the worker processor which handles job execution.
     */
    private initializeWorkerProcessor(): void {
        this.workerProcessor = async (job: Job) => {
            let result: any;
            this.logger.debug("Job arrived!", job.name);
            const task = this.tasks[job.name];
            if (task) {
                this.logger.debug(`Starting ${job.name}`);
                try {
                    await job.updateData(await task.handler(job.data));
                } catch (error: any) {
                    const message = `Error occurred during ${job.name} execution:\n${error.message}\n${error.stack}`;
                    this.logger.error({
                        message: message,
                        stack: error.stack,
                        job: job.name,
                    });
                    await job.log(message);
                    throw error;
                }
                this.logger.debug(`Completed ${job.name}`);
                return result ?? {};
            } else {
                throw new Error(`Handler for job ${job.name} not found!`);
            }
        };
    }


    /**
     * Lists all jobs in the queue.
     * @returns {Promise<Job[]>} List of jobs.
     */
    public async listJobs(): Promise<Job[]> {
        return this.queue.getJobs(["active", "waiting", "delayed", "completed"]);
    }

    /**
     * Lists all repeatable jobs in the queue.
     * @returns {Promise<any[]>} List of repeatable jobs.
     */
    public async listRepeatableJobSchedulers(): Promise<JobSchedulerJson[]> {
        const schedulers = await this.queue.getJobSchedulers(0, 10000000000000);
        console.log("Current job schedulers:", schedulers);
        return schedulers;
    }

    /**
     * Drains the queue, removing all jobs.
     * @returns {Promise<void>}
     */
    public async drainQueue(): Promise<void> {
        return this.queue.drain();
    }

    /**
     * Removes all jobs from the queue.
     * @returns {Promise<void>}
     */
    public async removeAllJobs(): Promise<void> {
        const jobs = await this.listJobs();
        for (const job of jobs) {
            try {
                await job.remove();
            } catch (err: any) {
                this.logger.error(`Error occurred while removing job "${job.id}":\n${err.message}\n${err.stack}`);
            }
        }
    }

    /**
     * Initializes repeating jobs in the queue.
     * @returns {Promise<void>}
     */
    private async initializeRepeatingJobs(): Promise<void> {
        for (const task of Object.values(this.tasks)) {
            if (!!task.options?.repeat) {
                await this.queue.upsertJobScheduler(
                    task.name, task.options.repeat, task,
                );
                this.logger.info(`[+] Added repeating task "${task.name}"`);
            }
        }
    }

    /**
     * Resets all repeating jobs in the queue.
     * @returns {Promise<void>}
     */
    public async resetRepeatingJobs(): Promise<void> {
        await this.removeAllRepeatableJobs();
        await this.initializeRepeatingJobs();
        await this.listRepeatableJobSchedulers();
    }

    /**
     * Removes repeatable jobs by their keys.
     * @param {string[]} keys - Keys of the jobs to remove.
     * @returns {Promise<any[]>} Result of job removals.
     */
    public async removeRepeatableJobsByKey(keys: string[]): Promise<any[]> {
        return Promise.all(keys.map(key => this.queue.removeJobScheduler(key)));
    }

    /**
     * Removes all repeatable jobs from the queue.
     * @returns {Promise<any[]>} Result of job removals.
     */
    public async removeAllRepeatableJobs(): Promise<any[]> {
        const repeatableJobSchedulers = await this.listRepeatableJobSchedulers();
        return this.removeRepeatableJobsByKey(repeatableJobSchedulers.map(rj => rj.key));
    }

    /**
     * Cleans the queue by draining and removing all jobs.
     * @returns {Promise<void>}
     */
    public async cleanQueue(): Promise<void> {
        await this.drainQueue();
        await this.removeAllRepeatableJobs();
        await this.removeAllJobs();
    }

    /**
     * Starts the worker.
     * @returns {Promise<void>}
     */
    public start(): Promise<void> {
        return this.worker.run();
    }

    /**
     * Stops the worker.
     * @returns {Promise<void>}
     */
    public async stop(): Promise<void> {
        await this.worker.close();
        await this.worker.disconnect();
    }
}

