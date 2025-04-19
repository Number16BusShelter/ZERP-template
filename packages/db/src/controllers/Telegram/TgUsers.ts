import { BadRequest } from "@zerp/errors";
import { isNumeric } from "@zerp/utils";
import AppDataSource from "../../data-source";
import { TgUsers } from "../../entities/Telegram/TgUsers";
import { BaseCRUDController } from "../abstract";
import { UsersController } from "../System";


export interface TgUserCreate {
    id: string,
    isBot?: boolean,
    firstName?: string,
    lastName?: string,
    username?: string,
    language?: "en"
}

// @ts-ignore
export class TgUsersController extends BaseCRUDController<TgUsers> {
    constructor() {
        super(TgUsers, ["user"]);
    }

    public static tgUsersRepository = AppDataSource.getRepository(TgUsers);

    public static async findOrCreate(tgUser: TgUserCreate): Promise<TgUsers> {
        const tgUsersCont = new TgUsersController();
        const dUser = await this.tgUsersRepository.findOne({
            where: {
                id: tgUser.id,
            },
        });
        if (!dUser) {
            return tgUsersCont.save({
                ...tgUser,
                user: await new UsersController().create({}),
            });
        }
        return dUser;
    }

    public async submitReferral<T>(
        referrerId: string,
        referralId: string,
        callback: (referrerTgUser: TgUsers, referralTgUser: TgUsers) => T | Promise<T> | void = (referrerTgUser, referredTgUser) => {
        },
    ): Promise<T | void> {
        const referrerUser = await this.find({
            id: referrerId,
        }, ["user", "user.profile"]);

        if (
            !referrerUser
            || !referrerUser.user
            // || !referrerUser.user.profile
        )
            throw new BadRequest("Referrer does not exist");

        let referralUser = await this.find({
            id: referralId,
        }, ["referrer"]);

        if (!referralUser) {
            // Create new user
            referralUser = await this.save({
                id: referralId,
                referrer: referrerUser,
                user: await new UsersController().create({}),
            });
        } else if (referralUser.referrer) {
            throw new BadRequest("User has already been referred!");
        }

        let callbackResult;
        callbackResult = await callback(
            referrerUser,
            referralUser,
        );
        referralUser.referrer = referrerUser;

        await this.primaryRepository.upsert(referralUser, ["id"]);
        await this.primaryRepository.upsert(referrerUser, ["id"]);

        return callbackResult;


    }

    public static async findReceiver(handle: string): Promise<TgUsers | undefined> {
        const tguc = new TgUsersController();
        let receiver;
        if (isNumeric(handle)) {
            receiver = await tguc.find({ id: handle }, ["user"]);
        } else {
            receiver = await tguc.find({ username: handle.replace("@", "") });
        }

        // if (!receiver) {
        //     throw new TelegramUserNotFound(handle);
        // }
        // @ts-ignore
        return receiver;
    }

    public static async update(user: TgUsers, options) {
        return this.tgUsersRepository.save(
            {
                ...user,
                ...options,
            });
    }
}

export default TgUsersController;

