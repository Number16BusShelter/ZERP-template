import {BadRequest, Unauthorized} from "./server";

export class TonConnectAuthFailure extends Unauthorized {
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, TonConnectAuthFailure.prototype);
    }
}

export class TonConnectSessionRequired extends Unauthorized {
    constructor() {
        super("TonConnect session is required for this action");
        Object.setPrototypeOf(this, TonConnectSessionRequired.prototype);
    }
}

export class UserAddressNotFound extends BadRequest {
    constructor(query: string) {
        super(`User address or name "${query}" was not found or does not exist. Try transfer by address`);
        Object.setPrototypeOf(this, TonConnectSessionRequired.prototype);
    }
}

export class BadAddressError extends BadRequest {
    constructor(address: string) {
        super(`Bad address provided: "${address}". Validate it and try again.`);
        Object.setPrototypeOf(this, TonConnectSessionRequired.prototype);
    }
}
