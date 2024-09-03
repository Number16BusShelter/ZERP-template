import config from "../../../../config";
import {app} from "@zerp/global-configs"

export const generatePayload = (userId) => {
    const secret = config.tonConnect.secret
    return `${app.name}::tonconnect::proof::${userId}::${secret}`
}
