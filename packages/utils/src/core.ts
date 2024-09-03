import { AppLogger, createErrorListener } from "./logging";

export async function contextRunner(
    entryPoint: () => Promise<void>,
    shutdownFN: () => Promise<void>,
    logger: AppLogger | undefined,
    exitOnError: boolean = true,
) {
    createErrorListener(logger, shutdownFN);
    process.on("*", (e) => {
        if (logger) logger.info(e)
    });
    process.on("SIGTERM", shutdownFN);
    process.on("SIGINT", shutdownFN);

    try {
        await entryPoint();
    } catch (e: any) {
        if (logger) logger.error({
            message: `Top level exception occurred: ${e.message}`,
            error: e,
            stack: e.stack ? e.stack : undefined,
        });
        if (exitOnError) {
            await shutdownFN();
        }
    }
}

