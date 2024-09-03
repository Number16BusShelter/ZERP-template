export class BadRequest extends Error {
    code: number = 400;
    httpCode: number = 400;

    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, BadRequest.prototype);
    }
}

export class Unauthenticated extends Error {
    code: number = 401;
    httpCode: number = 401;

    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, Unauthenticated.prototype);
    }
}

export class Unauthorized extends Error {
    code: number = 403;
    httpCode: number = 403;

    constructor(message = "Operation was not authorized") {
        super(message);
        Object.setPrototypeOf(this, Unauthorized.prototype);
    }
}

export class ServerError extends Error {
    code: number = 500;
    httpCode: number = 500;

    constructor(originalError: Error) {
        super(originalError.message);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export class LogicError extends ServerError {
    code: number = 8000;

    constructor(message: string | Error = "Logic error encountered!", metadata: object = {}) {
        super(message instanceof Error ? message : new Error(message));
        Object.setPrototypeOf(this, LogicError.prototype);
    }
}

export class NotImplementedError extends Error {
    code: number = 501;
    httpCode: number = 501;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}

