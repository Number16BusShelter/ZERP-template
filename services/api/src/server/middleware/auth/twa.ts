import moment from "moment";
import { v4 as uuid } from "uuid";
import { plainToInstance } from "class-transformer";
import { matchedData } from "express-validator";
import { NextFunction, Request, Response } from "express";

import { Unauthorized } from "@zerp/errors";
import { WebAppAuthParams } from "@zerp/types";
import { app, bot } from "@zerp/global-configs";
import { extractTWAAuthenticationParams, twaValidate } from "@zerp/utils";
import {
    TgUsersController,
    UsersController,
} from "@zerp/db";

import { checkValidationResult, createValidationFor } from "@/src/server/middleware/validation/express";

const extractTWAAuthData = (req: Request): WebAppAuthParams => {
    const {
        query_id,
        chat_type,
        chat_instance,
        start_param,
        id,
        first_name,
        last_name,
        username,
        language_code,
        auth_date,
        hash,
        added_to_attachment_menu,
        allows_write_to_pm,
        is_premium,
        photo_url,
    } = matchedData(req);

    return plainToInstance(WebAppAuthParams, {
        query_id,
        chat_type,
        chat_instance,
        start_param,
        id: id.toString(),
        first_name,
        last_name: last_name || "",
        username,
        language_code,
        auth_date,
        hash,
        added_to_attachment_menu,
        allows_write_to_pm,
        is_premium,
        photo_url,
    });
};

const validateTWAAuth = async (authData: WebAppAuthParams, checkExpiration: boolean = !app.debug) => {
    const authResult = await twaValidate(extractTWAAuthenticationParams(authData), bot.token);

    if (!authResult) {
        throw new Unauthorized(`TWA user with ID ${authData.id} did not authenticate!`);
    }
    const hasExpired = moment().diff(moment.unix(<number>authData.auth_date), "days") > 1;

    if (hasExpired && checkExpiration) {
        throw new Unauthorized(`Token has expired!`);
    }
};

export const handleUserEntities = async (authData: WebAppAuthParams | { id: string }) => {
    const uc = new UsersController();
    const tguc = new TgUsersController();

    let user, tgUser;

    try {
        tgUser = await tguc.find({ id: authData.id }, ["user", "user.profile", "user.profile.clan"], { cache: 60000 });

        if (!tgUser) {
            if (!bot.optimisticSignUp) {
                throw new Unauthorized(`TWA user not associated with Telegram user ID ${authData.id}`);
            }

            user = await uc.create({ id: uuid() });
            tgUser = await tguc.createOrUpdate({ id: authData.id },
                authData instanceof WebAppAuthParams
                    ? { ...authData.toDbData(), user }
                    : { id: authData.id, user });
        } else {
            await tguc.updatePartial(
                { id: tgUser.id }, authData instanceof WebAppAuthParams
                    ? authData.toDbData()
                    : { id: authData.id },
            );

            user = tgUser.user || await uc.create({ id: uuid() });
            if (!tgUser.user) {
                tgUser.user = user;
                tgUser = await tguc.save(tgUser);
            }
        }

        return { user, tgUser };
    } catch (error) {
        throw error;
    }
};

export const _validateTWAUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authData = extractTWAAuthData(req);
        await validateTWAAuth(authData);
        const { user, tgUser } = await handleUserEntities(authData);

        req["user"] = user;
        req["tgUser"] = tgUser;

        next();
    } catch (e) {
        next(e);
    }
};

export const validateTWAUser = [
    createValidationFor("twa_authorization"),
    checkValidationResult,
    _validateTWAUser,
];


