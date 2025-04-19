import defaultGlobalConfig from "@zerp/global-configs";
import { AppContext, AppsAvailable, AppsMap } from "@zerp/types";
import { AppLogger, createLogger, contextRunner } from "@zerp/utils";
import { LogicError } from "@zerp/errors";

/**
 * Function signature for running application context with lifecycle hooks.
 * @param entryPoint - Async function to start the app.
 * @param shutdownFN - Async function to shutdown the app.
 * @param logger - Optional logger instance.
 * @param exitOnError - Whether to exit process on error.
 */
export interface ContextRunner {
    (
        entryPoint: () => Promise<void>,
        shutdownFN: () => Promise<void>,
        logger?: AppLogger,
        exitOnError?: boolean,
    ): Promise<void>;
}

/**
 * Abstract base class for global application context management.
 * Handles app lifecycle, configuration, logging, and enabled apps.
 */
export abstract class GlobalAbstractContext {

    /** List of enabled apps from AppsAvailable enum */
    public appsEnabled: AppsAvailable[] = [];

    /** Global logger instance */
    public globalLogger: AppLogger;

    /** Global configuration object */
    protected globalConfig: any;

    /** Context runner function to manage lifecycle */
    protected contextRunner: ContextRunner;

    /** Flag to enable shutdown on error */
    public abstract shutdownOnErrorEnabled: boolean;

    /** Map of app names to app context classes */
    public appsMap: AppsMap;

    /** Instances of enabled app contexts */
    public appInstances: Record<AppsAvailable, new () => AppContext>;

    /**
     * Constructs the global context.
     * @param params.appsEnabled - Array of enabled app names as strings.
     * @param params.appsMap - Map of app names to app context classes.
     * @param params.globalConfig - Optional global configuration override.
     * @param params.globalLogger - Optional global logger override.
     */
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

    /**
     * Boots the application context.
     * @returns Promise resolving when boot completes.
     */
    public boot() {
        return this._boot();
    }

    /**
     * Retrieves an enabled app instance by name.
     * @param appName - App name from AppsAvailable enum.
     * @throws LogicError if app is not enabled.
     * @returns The app instance typed as T.
     */
    protected getApp<T>(appName: AppsAvailable): T {
        if (!this.appsEnabled.includes(AppsAvailable[appName])) throw new LogicError(`App '${AppsAvailable[appName]}' is not enabled. Please add it to 'appsEnabled' in your configuration file.`)
        return this.appInstances[appName] as T
    }

    /**
     * Retrieves multiple enabled app instances by their names.
     * @param appsNames - Array of app names as strings.
     * @returns Record mapping app enum keys to app instances.
     */
    protected getApps(appsNames: string[]) {
        const apps = appsNames.map(an => AppsAvailable[an])
        return apps.reduce((acc, app: AppsAvailable) => {
            acc[app] = this.getApp(app);
            return acc;
        }, {} as Record<AppsAvailable, new () => AppContext>);
    }

    /**
     * Internal boot method that runs the context runner with startup and shutdown hooks.
     */
    protected async _boot() {
        return contextRunner(() => this._startUp(), () => this._shutDown(), this.globalLogger, this.shutdownOnErrorEnabled);
    }

    /**
     * Logs startup information about the app mode, debug status, and root directory.
     */
    protected startUpInfo() {
        this.globalLogger.info(`> App is running in ${this.globalConfig.app.mode} mode`);
        if (this.globalConfig.app.debug) this.globalLogger.warn(`>>> DEBUG ${this.globalConfig.app.debug ? "ENABLED" : "DISABLED"} <<<`);
        this.globalLogger.info(`> App root is now \'${this.globalConfig.app.rootDir}\'`);
    }

    /**
     * Internal startup method called by context runner.
     * Logs startup info and calls abstract startUp method.
     */
    public async _startUp() {
        this.startUpInfo();
        await this.startUp();
        // Get enable services and try to start them
    }

    /**
     * Internal shutdown method called by context runner.
     * Attempts graceful shutdown and exits process accordingly.
     */
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

    /**
     * Abstract method to implement startup logic.
     */
    public abstract startUp(): Promise<void>

    /**
     * Abstract method to implement shutdown logic.
     */
    public abstract shutDown(): Promise<void>
}
