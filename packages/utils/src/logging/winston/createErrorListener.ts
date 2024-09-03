export function createErrorListener(logger, exitCommand?: () => {}, shutdownOnError: boolean = false) {
    process.on("unhandledRejection", (reason: any, promise) => {
        // Log the stack trace if it exists
        logger.error({
            message: "Unhandled Rejection:\n"
                + reason,
            promise: promise,
            error: reason,
            stack: reason.stack ? reason.stack : undefined,
        });


        // You might want to shut down gracefully here
        if (shutdownOnError) {
            exitCommand ? exitCommand() : process.exit(1);
        }
    });

    process.on("uncaughtException", (error) => {
        logger.error({
            message: "Unhandled exception: " + error.message,
            error: error,
            stack: error.stack,
        });
        // You might want to shut down gracefully here
        // You might want to shut down gracefully here
        if (shutdownOnError) {
            exitCommand ? exitCommand() : process.exit(1);
        }
    });
}
