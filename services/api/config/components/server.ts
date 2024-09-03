import {app} from "@zerp/global-configs"

export default {
    host: process.env.API_HOST ?? app.host,
    port: process.env.API_PORT ?? app.host,
    secretRoute: process.env.API_SECURE_ROUTE ?? 'ZTM4ZGFkZDY3NmEy',
    defaultApiTokenHash: process.env.DEFAULT_API_TOKEN_HASH
}
