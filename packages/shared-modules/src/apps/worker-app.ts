import { AppContext } from "@zerp/types";
import { AppLogger } from "@zerp/utils";
import { startWorker, stopWorker, bullLogger } from "../modules/bull";
import { Worker } from "bullmq";

export class WorkerApp extends AppContext {
    protected logger: AppLogger = bullLogger;
    private worker: Worker;

    public async start(): Promise<Worker> {
        this.worker = await startWorker();
        return this.worker;
    }

    public async stop() {
        if (!this.worker) {
            this.logger.warn("No worker to stop!");
            return;
        }
        return stopWorker(this.worker);
    }
}
