import moment from "moment";
import Passworder from "./passworder";
import { server as serverConfig } from "../../../config";
import { AuthTokens, AuthTokensController } from "@zerp/db";
import { Unauthorized } from "@zerp/errors"; // Adjust the path accordingly

export default class AuthValidator {
    constructor(
        private readonly authController: AuthTokensController = new AuthTokensController(),
        private readonly passworder: Passworder = new Passworder(),
    ) {
    }

    /**
     * Validates the request authorization token.
     * @param tokenInBase64 - The token to validate.
     * @returns A promise resolving to `true` if the token is valid, `false` otherwise.
     */
    public async validateRequestAuthorizationToken(
        tokenInBase64: string,
    ): Promise<AuthTokens | null | never> {
        const [id, secret] = this.passworder.decodeBase64Token(tokenInBase64).split("=:=");

        if (!id || !secret) {
            throw new Unauthorized("Invalid token structure.");
        }

        const record = await this.authController.find(id);

        const isValidDefaultToken = serverConfig.defaultApiTokenHash
            ? this.passworder.checkSecret(secret, serverConfig.defaultApiTokenHash)
            : false;

        if (isValidDefaultToken) return null

        if (!record) {
            throw new Unauthorized("No record found for the provided token.");
        }

        if (moment().isAfter(record.validUntil)) {
            throw new Unauthorized("Token has expired.");
        }

        if (!record.isActive) {
            throw new Unauthorized("Token is not active.");
        }

        const isValidSecret = this.passworder.checkSecret(secret, record.hash);

        if (!isValidSecret) {
            throw new Unauthorized("Invalid token secret.");
        }

        await this.authController.updateLastUsedAt(record.id);

        return record;
    }

    /**
     * Creates a new API authorization token.
     * @param name - The name of the authorization token.
     * @param validUntil - The validity duration of the token.
     * @returns A promise resolving to the created record and the generated key.
     */
    public async createNewApiAuthorizationToken({
                                                    name,
                                                    validUntil,
                                                }: {
        name?: string;
        validUntil?: Date;
    }) {
        const secret = this.passworder.generateSecret();
        const transport = this.passworder.getSecretTokenTransport(secret);
        const newValidUntil = validUntil ?? moment().add(1, "year").toDate();
        const newName = name ?? AuthTokensController.generateName();
        const record = await this.authController.save({
            name: newName,
            description: AuthTokensController.generateDescription(newValidUntil),
            isActive: true,
            hash: this.passworder.getHashFromTransport(transport),
            validUntil: newValidUntil,
            lastUsedAt: new Date(),
        });

        return {
            record,
            token: this.passworder.encodeToBase64(`${record.id}=:=${secret}`),
        };
    }


}
