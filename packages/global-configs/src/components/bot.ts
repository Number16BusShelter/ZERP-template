import app from "./app";
import rules from "./rules";

export default {
    name: app.name,
    mode: app.mode,
    token: process.env.BOT_TOKEN || rules.REQ("BOT_TOKEN"),
    webAppHost: process.env.WEBAPP_HOST || "http://localhost:7272",
    username: process.env.BOT_NAME,
    backendHost: process.env.WEBAPP_BACKEND_HOST || app.handle,
    optimisticSignUp: true,
    defaultLanguage: "en",
    testNet: app.testNet,
}
