import { Strategy, ExtractJwt } from "passport-jwt";

import { jwt } from "@zerp/global-configs";
import { UsersController } from "@zerp/db";

const JWTStrategy = new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt!.secret,
        ignoreExpiration: jwt.ignoreExpiration,
        algorithms: ['HS256'],
    },
    async function (payload, done) {
        const id = payload.userId;
        const user = await new UsersController().find(id, ["addresses"]);
        // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        if (user) return done(null, user); else return done('Unauthorized');

    }
);

export default JWTStrategy;
