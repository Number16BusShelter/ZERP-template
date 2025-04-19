import { generateRandomString } from "@zerp/utils";
import { app as appConfig, rules } from "@zerp/global-configs"

const manifestHost = process.env.MANIFEST_URL || rules.REQ('MANIFEST_URL')

export default {
    secret: process.env.TON_CONNECT_SECRET || process.env.SESSION_SECRET || generateRandomString(32),
    manifest: {
        "production": {
            "url": manifestHost,
            "name": "Telegram Bot",
            "iconUrl": `${manifestHost}/apple-touch-icon.png`,
            "termsOfUseUrl": "https://ton-connect.github.io/demo-dapp-with-react-ui/terms-of-use.txt",
            "privacyPolicyUrl": "https://ton-connect.github.io/demo-dapp-with-react-ui/privacy-policy.txt",
        },

    }[appConfig.mode],
};
