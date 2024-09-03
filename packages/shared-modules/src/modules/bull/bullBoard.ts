import { Queue } from "bullmq";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { BoardOptions } from "@bull-board/api/dist/typings/app";
import { ExpressAdapter } from "@bull-board/express";

import { BullConfig } from "./bullModule";
import { AppLogger, createLogger } from "@zerp/utils";
import { app } from "@zerp/global-configs";


export default class BullBoard {
    private readonly queues: Queue[];
    private queueNames: string[] = [];

    constructor(
        private readonly config: BullConfig,
        private readonly logger: AppLogger = createLogger({
            name: app.name,
            subModule: "bull-board",
        }),
    ) {
        this.queueNames.push(config.queueName);
        this.queues = this.queueNames.map(name => new Queue(name, config.defaultOptions));
    }

    private createBoard(serverAdapter, options?: BoardOptions) {
        return createBullBoard({
            queues: this.queues.map(q => new BullMQAdapter(q)),
            serverAdapter: serverAdapter,
            options,
        });
    }

    public getBoardAdapter(options?) {
        options = options || this.config.board;
        if (!options) throw new Error("Failed to initialize board adapter. Options are undefined");
        const serverAdapter = new ExpressAdapter();
        serverAdapter.setUIConfig(options.uiConfig);
        serverAdapter.setBasePath(options.uiBasePath);
        this.logger.warn(`> Creating Bull Board Adapter...`);
        this.createBoard(serverAdapter);
        return serverAdapter;
    }
}



