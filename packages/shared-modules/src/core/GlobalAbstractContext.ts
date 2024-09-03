import defaultGlobalConfig from "@zerp/global-configs";
import { AppContext, AppsAvailable, AppsMap } from "@zerp/types";
import { AppLogger, createLogger, contextRunner } from "@zerp/utils";
import { LogicError } from "@zerp/errors";

export interface ContextRunner {
    (
        entryPoint: () => Promise<void>,
        shutdownFN: () => Promise<void>,
        logger?: AppLogger,
        exitOnError?: boolean,
    ): Promise<void>;
}


export abstract class GlobalAbstractContext {

    public appsEnabled: AppsAvailable[] = [];

    public globalLogger: AppLogger;

    protected globalConfig: any;

    protected contextRunner: ContextRunner;

    public abstract shutdownOnErrorEnabled: boolean;

    public appsMap: AppsMap;

    public appInstances: Record<AppsAvailable, new () => AppContext>;

    protected constructor(
        {
            appsEnabled,
            appsMap,
            globalConfig = defaultGlobalConfig,
            globalLogger = createLogger(defaultGlobalConfig.logging),
        }: {
            appsEnabled: string[],
            appsMap: AppsMap,
            globalConfig?: any,
            globalLogger?: AppLogger,
        },
    ) {
        this.appsMap = appsMap;
        this.globalConfig = globalConfig;
        this.globalLogger = globalLogger;
        this.appsEnabled = appsEnabled.map(ae => AppsAvailable[ae]);

        this.appInstances = this.appsEnabled.reduce((acc, app) => {
            // @ts-ignore
            acc[app] = new this.appsMap[app]()
            return acc;
        }, {} as Record<AppsAvailable, new () => AppContext>);
    }

    public boot(
        // appsEnabled: string[]
    ) {
        return this._boot();
    }

    protected getApp<T>(appName: AppsAvailable): T {
        if (!this.appsEnabled.includes(AppsAvailable[appName])) throw new LogicError(`App '${AppsAvailable[appName]}' is not enabled. Please add it to 'appsEnabled' in your configuration file.`)
        return this.appInstances[appName] as T
    }

    protected getApps(appsNames: string[]) {
        const apps = appsNames.map(an => AppsAvailable[an])
        return apps.reduce((acc, app: AppsAvailable) => {
            acc[app] = this.getApp(app);
            return acc;
        }, {} as Record<AppsAvailable, new () => AppContext>);
    }

    protected async _boot() {
        return contextRunner(() => this._startUp(), () => this._shutDown(), this.globalLogger, this.shutdownOnErrorEnabled);
    }

    protected startUpInfo() {
        this.globalLogger.info(`> App is running in ${this.globalConfig.app.mode} mode`);
        if (this.globalConfig.app.debug) this.globalLogger.warn(`>>> DEBUG ${this.globalConfig.app.debug ? "ENABLED" : "DISABLED"} <<<`);
        this.globalLogger.info(`> App root is now \'${this.globalConfig.app.rootDir}\'`);
    }

    public async _startUp() {
        this.startUpInfo();
        await this.startUp();
        // Get enable services and try to start them
    }

    public async _shutDown() {
        this.globalLogger.info("Received KILL signal, shutting down gracefully.");
        try {
            await this.shutDown();
            this.globalLogger.info("Graceful shutdown complete with no errors. Exiting.");
            process.exit(0);
        } catch (err) {
            this.globalLogger.error("!!! Error during graceful shutdown:", err);
            process.exit(1);
        }
    }

    public abstract startUp(): Promise<void>

    public abstract shutDown(): Promise<void>
}
