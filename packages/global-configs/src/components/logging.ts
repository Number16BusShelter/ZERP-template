import app from "./app";

const loggerConfig = {
        level: app.debug ? "debug" : "info",
        name: app.name,
        service: app.service,
        subModule: app.service,
}

export default loggerConfig
