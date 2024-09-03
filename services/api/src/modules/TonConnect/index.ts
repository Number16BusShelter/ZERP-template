import TonConnect, { IStorage } from "@tonconnect/sdk";
import { TonConnectSessionStorage } from "@zerp/db";
import { app } from "@zerp/global-configs";

const storage = new Map<string, string>();

export class LocalIStorageWithPrefix implements IStorage {
    constructor(
        private readonly chatId: string,
    ) {
    } // we need to have different stores for different users

    private getKey(key: string): string {
        return this.chatId.toString() + key; // we will simply have different keys prefixes for different users
    }

    async removeItem(key: string): Promise<void> {
        storage.delete(this.getKey(key));
    }

    async setItem(key: string, value: string): Promise<void> {
        storage.set(this.getKey(key), value);
    }

    async getItem(key: string): Promise<string | null> {
        return storage.get(this.getKey(key)) || null;
    }
}

class LocalIStorage implements IStorage {
    async removeItem(key: string): Promise<void> {
        storage.delete(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        storage.set(key, value);
    }

    async getItem(key: string): Promise<string | null> {
        return storage.get(key) || null;
    }
}

const manifestUrl = app.handle + "/ton-connect/manifest.json";

export const getConnector = (userId) => new TonConnect({
    manifestUrl: manifestUrl,
    storage: new TonConnectSessionStorage(userId),
});

export function addReturnStrategy(url: string, returnStrategy: "back" | "none"): string {
    const link = new URL(url);
    link.searchParams.append("ret", returnStrategy);
    return link.toString();
}

// const connector = getConnector()
