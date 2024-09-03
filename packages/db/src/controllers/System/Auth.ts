import { BaseCRUDController } from "../abstract";
import { AuthTokens } from "../../entities";


export class AuthTokensController extends BaseCRUDController<AuthTokens> {
    constructor() {
        super(AuthTokens, ["user"]);
    }

    public async updateLastUsedAt(authTokenId: string) {
        return this.save({
            id: authTokenId,
            lastUsedAt: new Date()
        })
    }

    public static generateName(): string {
        return new Date()
            .toISOString()
            .replace(/\..+/, "")
            .replace(/[-:T]/g, "")
            .slice(2, 14);
    }

    public static generateDescription(validUntil: Date): string {
        return `Authorization token generated on ${new Date().toUTCString()} valid until ${validUntil.toUTCString()}`;
    }
}
