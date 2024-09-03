import AppDataSource from "../../data-source";
import {
    TgUpdates
} from "../../entities";

import { TgUsersController } from "./TgUsers";
import { TgChatsController } from "./TgChats";
import { TgMessagesController } from "./TgMessages";

export class TgUpdatesController {
    public static tgUpdatesRepository = AppDataSource.getRepository(TgUpdates);

    public static tgUsersController = TgUsersController;
    public static tgChatsController = TgChatsController;
    public static tgMessagesController = TgMessagesController;

    public static async create(ctx) {
        const updateType = ctx.updateType;
        const updateId = ctx.update.update_id;

        const body = ctx.update[updateType];
        const from = body.from;
        const chat = body.chat;

        const dUser = await this.tgUsersController.findOrCreate({
            id: String(from.id),
            isBot: from.is_bot,
            firstName: from.first_name,
            username: from.username,
            language: from.language_code,

        })

        let dChat;

        if (chat) {
            dChat = await this.tgChatsController.findOrCreate({
                id: String(chat.id),
                type: chat ? chat.type : null,
                user: dUser
            })
        }

        const dMessage = await this.tgMessagesController.findOrCreate({
            id: String(body.message_id || body.id),
            user: dUser,
            chat: dChat,
            date: body.date ? new Date(body.date * 1000) : new Date(),
            text: body.text,
        })

        return await this.tgUpdatesRepository.save({
            id: String(updateId),
            message: dMessage,
            type: updateType,
        })
    }
}

export default TgUpdatesController
