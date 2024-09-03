import colors from "colors";
import { format } from "date-fns";


function resSerializer(res) {
    return {
        res: res.code,
    };
}

function reqSerializer(req) {
    return {
        requestHeaders: req.headers,
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.body,
        ip: req.ip || req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress || req.socket.remoteAddress,
        url: req.url,
        headers: req.headers,
        timestamp: new Date().getTime(),
    };
}


export function randomColorFromString(str: string,  colorsArray = [
        colors.red,
        colors.cyan,
        colors.green,
        colors.blue,
        colors.magenta,
    ]) {
    return colorsArray[(str.length % colorsArray.length)](str)
}

export const logTime = (time = new Date()) => format(new Date(time), "yyyy-MM-dd HH:mm:ss");

export const fxFromLevel = (level) => {
    switch (level.toUpperCase()) {
        case "DEBUG":
            return (msg) => colors.yellow(msg);
        case "INFO":
            return (msg) => colors.cyan(msg);
        case "ERROR":
            return (msg) => colors.red(msg);
        case "FATAL":
            return (msg) => colors.bgRed(msg);
        default:
            return (msg => msg);
    }
};

export function formatLog(
    data,
    nocolor: boolean = (process.env.NODE_ENV == 'production'),
    fx = nocolor
        ? (data) => data
        : fxFromLevel(data.level ?? "info"),
) {
    const path = (data.name ?? "app") + (!!data.subModule ? `:${data.subModule}` : "")
    const pathColored = nocolor ? path : randomColorFromString(path)
    return ``
        + `[${colors.green(logTime(data.time))}]`
        + ` [${fx(data.level.toUpperCase())}]`
        + ` [${pathColored}] :`
        + ` ${fx(data.message)}`
        + ` ${data.stack ? `${data.stack}` : ''}`
        + ` ${data.reason ? `${data.reason}` : ''}`
        + ` ${data.splat ? `${data.splat}` : ''}`
}
