import {BadRequest} from "./server";

export class TelegramUserNotFound extends BadRequest {
    code: number = 1001

    constructor(handle) {
        super(`Telegram user with handle or ID ${handle} was not found`);
        Object.setPrototypeOf(this, TelegramUserNotFound.prototype);
    }
}
