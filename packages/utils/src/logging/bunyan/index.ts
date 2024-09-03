// import colors from "colors";
// import bunyan, { LogLevel } from "bunyan";
// import { LoggerConfig } from "@zerp/types";
// import { formatLog } from "./common";
//
// const defaultLogFormat = function(rec) {
//     rec = JSON.parse(rec);
//     const level = bunyan.nameFromLevel[rec.level].toUpperCase();
//     // console.log(rec)
//     let fx = (msg) => msg;
//     let fn = console.log;
//
//     switch (level.toUpperCase()) {
//         case "DEBUG":
//             fx = (msg) => colors.yellow(msg);
//             break;
//         case "INFO":
//             fx = (msg) => colors.cyan(msg);
//             break;
//         case "ERROR":
//             fx = (msg) => colors.red(msg);
//             break;
//         case "FATAL":
//             fx = (msg) => colors.bgRed(msg);
//             break;
//     }
//
//     const message = formatLog({
//         level,
//         name: rec.name,
//         message: rec.msg,
//         time: rec.time
//
//     })
//     console.log(message);
// };
//
// export const createLogger = (config: LoggerConfig) => {
//     function MyRawStream() {}
//     MyRawStream.prototype.write = defaultLogFormat
//
//     return bunyan.createLogger({
//         name: (config.name ?? "app") + (!!config.subModule ? `:${config.subModule}` : ""),
//         level: (config.level ?? "info") as LogLevel,
//         src: true,
//         streams: [
//             {
//                 level: config.level as LogLevel,
//                 stream: new MyRawStream(), // log INFO and above to stdout
//             },
//         ],
//     });
// };
