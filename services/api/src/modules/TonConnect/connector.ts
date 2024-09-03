import TonConnect from "@tonconnect/sdk";
import { TonConnectSessionStorage } from "@zerp/db";
import * as process from 'process';

type StoredConnectorData = {
    connector: TonConnect;
    timeout: ReturnType<typeof setTimeout>;
    onConnectorExpired: ((connector: TonConnect) => void)[];
};

const connectors = new Map<string, StoredConnectorData>();

export function getConnector(
    userId: string,
    onConnectorExpired?: (connector: TonConnect) => void
): TonConnect {
    let storedItem: StoredConnectorData;
    if (connectors.has(userId)) {
        storedItem = connectors.get(userId)!;
        clearTimeout(storedItem.timeout);
    } else {
        storedItem = {
            connector: new TonConnect({
                manifestUrl: process.env.MANIFEST_URL,
                storage: new TonConnectSessionStorage(userId)
            }),
            onConnectorExpired: []
        } as unknown as StoredConnectorData;
    }

    if (onConnectorExpired) {
        storedItem.onConnectorExpired.push(onConnectorExpired);
    }

    storedItem.timeout = setTimeout(() => {
        if (connectors.has(userId)) {
            const storedItem = connectors.get(userId)!;
            storedItem.connector.pauseConnection();
            storedItem.onConnectorExpired.forEach(callback => callback(storedItem.connector));
            connectors.delete(userId);
        }
    }, Number(process.env.CONNECTOR_TTL_MS));

    connectors.set(userId, storedItem);
    return storedItem.connector;
}
