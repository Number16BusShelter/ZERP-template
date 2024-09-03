import AppDataSource from "../../data-source";
import { TgChats, TgUsers } from "../../entities";

interface TgChatCreate {
    id: string,
    type: string,
    user: TgUsers,
}

export class TgChatsController {
    public static tgChatsRepository = AppDataSource.getRepository(TgChats);

    public static async findOrCreate(chat: TgChatCreate): Promise<TgChats> {
        const dChat = await this.tgChatsRepository.findOne({
            where: {
                id: chat.id
            }
        })
        if (!dChat) {
            return this.tgChatsRepository.save(chat)
        }
        return dChat;
    }
}

export default TgChatsController
