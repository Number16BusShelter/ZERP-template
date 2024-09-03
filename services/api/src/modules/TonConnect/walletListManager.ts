import {isWalletInfoRemote, WalletInfo, WalletInfoRemote, WalletsListManager} from "@tonconnect/sdk";
import config from "../../../config";

const walletsListManager = new WalletsListManager({
    cacheTTLMs: Number(process.env.WALLETS_LIST_CAHCE_TTL_MS)
});

export async function getWallets(): Promise<WalletInfoRemote[]> {
    const wallets = await walletsListManager.getWallets();
    return wallets.filter(isWalletInfoRemote);
}

export async function getWalletInfo(walletAppName: string = config.tonConnect.manifest.name): Promise<WalletInfo | undefined> {
    const wallets = await getWallets();
    return wallets.find(wallet => wallet.appName.toLowerCase() === walletAppName.toLowerCase());
}
