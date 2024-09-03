import AppDataSource from "../../data-source";
import { TgChats, TgUsers, TgMessages } from "../../entities";

export interface TgMessageCreate {
    id: string,
    chat?: TgChats,
    user: TgUsers,
    date: Date,
    text: string,
    raw?: any
}

export class TgMessagesController {
    public static tgMessagesRepository = AppDataSource.getRepository(TgMessages);

    public static async findOrCreate(message: TgMessageCreate): Promise<TgMessages> {
        const dMessage = await this.tgMessagesRepository.findOne({
            where: {
                id: message.id
            }
        })

        if (!dMessage) {
            return this.tgMessagesRepository.save(message);
        }

        return (await this.tgMessagesRepository.update({
            id: message.id
        }, message))[0]
    }
}

export default TgMessagesController


