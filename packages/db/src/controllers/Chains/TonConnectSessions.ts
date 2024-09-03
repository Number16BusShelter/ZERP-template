import {TonConnectSessions} from "@/entities";
import AppDataSource from "../../data-source";
import {BaseCRUDController} from "../abstract";


export class TonConnectSessionStorage extends BaseCRUDController<TonConnectSessions>{
    sessionRepository = AppDataSource.getRepository(TonConnectSessions)
    userId: string
    constructor(userId: string) {
        super(TonConnectSessions, [])
        this.userId = userId
    }

    async removeItem(key: string): Promise<void> {
        await this.sessionRepository.delete({user: {id: this.userId}, key})
    }

    async setItem(key: string, value: string): Promise<void> {
        let session = await this.sessionRepository.findOne({where: {user: {id: this.userId}, key}})
        if (!!session) {
            await this.sessionRepository.update({userId: this.userId, key: key}, {session: value})
        } else {
            await this.sessionRepository.upsert({user: {id: this.userId}, key, session: value}, {
                conflictPaths: ['userId', 'key'],
                skipUpdateIfNoValuesChanged: true
            })
        }
    }

    async getItem(key: string): Promise<string | null> {
        const tonS = await this.sessionRepository.findOne({where: {user: {id: this.userId}, key}});
        return tonS?.session || null
    }
}

export default TonConnectSessionStorage
