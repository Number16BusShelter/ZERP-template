import { Users, TgUsers } from "@zerp/db";

declare global {
    namespace Express {
        interface Request {
            user?: Users;
            tgUser?: TgUsers;
        }
    }
}
