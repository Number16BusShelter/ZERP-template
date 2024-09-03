import errorMessages from "./components/errorMessages";
import logging from "./components/logging";
import rules from "./components/rules";
import app, {isDev, isProd} from "./components/app";
import bot from "./components/bot";
import db from "./components/db";
import bull from "./components/bull";
import jwt from "./components/jwt";
import redis from "./components/redis";
import socketio from "./components/socketio"

export {
    db,
    bot,
    bull,
    app,
    jwt,
    redis,
    logging,
    errorMessages,
    rules,
    socketio,
    isDev, isProd
};

export default {
    db,
    bot,
    bull,
    app,
    jwt,
    redis,
    logging,
    errorMessages,
    rules,
    socketio,
    isDev, isProd
};


