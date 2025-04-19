import globalConfig from "@zerp/global-configs";
import jwt, { Algorithm } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import passportIndex from "passport";
import JWTStrategy from "../passport/strategies/jwt";
import { Unauthenticated } from "@zerp/errors";

// ALT DOCS
// https://github.com/jwalton/passport-api-docs


passportIndex.serializeUser((user, done) => {
    console.log("serialize", user);
    done(null, user);
});

passportIndex.deserializeUser(async (user, done) => {
    console.log("deserialize user", user);
    if (user) {
        done(null, user);
    } else {
        done(new Error("User does not exist"), null);
    }
});

// passportIndex.use(LocalStrategy);
// @ts-ignore
passportIndex.use("jwt", JWTStrategy);

export function authenticateLocal(req, res, next) {
    return passportIndex.authenticate("local", { passReqToCallback: true, session: false })(req, res, next);
}

export function authenticateJWT(req, res, next) {
    return passportIndex.authenticate("jwt", { session: false })(req, res, next);
}

export function authenticateWebApp(req, res, next) {
    return passportIndex.authenticate("webapp", { session: false })(req, res, next);
}

export function decodeJWT(token): any {
    return jwt.verify(token, globalConfig.jwt!.secret, {
        algorithms: [globalConfig.jwt!.algorithm as Algorithm],
        ignoreExpiration: globalConfig.jwt!.ignoreExpiration,
    });
}

export function encryptJWTPayload(payload) {
    const jwtOptions: jwt.SignOptions = {
        algorithm: globalConfig.jwt!.algorithm as jwt.Algorithm,
        expiresIn: globalConfig.jwt!.expiration as number,
    };
    return jwt.sign(payload, globalConfig.jwt!.secret! as jwt.Secret, jwtOptions);
}

export function generateJWT(req, additionalParams = {}) {
    const payload = {
        userId: req.user.id,
        tgUserId: req.user.tgUser?.id,
        profileId: req.user.profile?.id,
        sessionId: uuid(),
        ...additionalParams,
    };

    return encryptJWTPayload(payload);
}

export const issueJWTToken = async (req, res): Promise<void> => {
    if (!req.user) throw new Unauthenticated("User not authenticated!");
    const loggedInAt = Math.round(new Date().getTime() / 1000);
    const token = generateJWT(req, {
        loggedInAt,
    });

    const jwtResp: JWTTokenResp = {
        token: token,
        loggedInAt,
        expires: Math.round(new Date().getTime() / 1000) + globalConfig.jwt!.expiration,
    };

    res.json(jwtResp)
};

export function generateTestToken() {
    let nl = `\n–––––––––––––––––––––––––––––\n`;

    function logTokenInfo(userId: string, token: string, number?: number) {
        console.log(nl
            + (number ? `${nl}Player #${number}${nl}` : nl)
            + `Test JWT token for user ${userId}: `
            + `Bearer: ${token}` + nl
            + `Decode: ${JSON.stringify(decodeJWT(token), null, 2)}` + nl,
        );
    }

    const users = [
        "de1da777-4343-4f69-8102-9589717450ee",
        "8148b87c-74e7-44ea-a0c7-a9fed9978a0d",
    ];

    return users.map((u, i) => {
        const token = encryptJWTPayload({
            userId: u,
            sessionId: "test_session",
        });
        logTokenInfo(u, token, i + 1);
        return token;
    });
}

type JWTTokenResp = {
    token: string,
    loggedInAt: number,
    expires: number
}

export default passportIndex;

export { passportIndex };
