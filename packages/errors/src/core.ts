export class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}

export class CriticalError extends Error {
    constructor({ message, stack, reason, error }) {
        message = `[!!!CRITICAL!!!] Critical exception occurred!\n${message}`
            + `${stack ? `${stack}` : ``}`
            + `${error ? `${error}` : ``}`
            + `Exiting now!`;
        super(message);
        Object.setPrototypeOf(this, CriticalError.prototype);
    }
}
