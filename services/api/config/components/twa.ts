import crypto from "crypto"

import { app, bot } from "@zerp/global-configs";

const hmac = crypto.createHmac('sha256', 'WebAppData');
const secretKey = hmac.update(bot.token!);

export default {
    url: `https://${app.host}/`,
    secretKey: secretKey,
}
