import { EventEmitter } from "node:events";

export abstract class AppContext {
    protected abstract logger: EventEmitter;

    public async start(...any: any[]): Promise<any> {
    }

    public async stop(...any: any[]): Promise<any> {
    }
}

export enum AppsAvailable {
    api = 'api',
    db = 'db',
    io = 'io',
    worker = 'worker',
    client = 'client',
}

export type GenericCallback = (...args: any[]) => any | void | Promise<any | void>;
export type AppsMap = Record<string, typeof AppContext>
