import errorMessages from "./components/errorMessages";
import logging from "./components/logging";
import rules from "./components/rules";
import app, { isDev, isProd } from "./components/app";
import bot from "./components/bot";
import db from "./components/db";
import bull from "./components/bull";
import jwt from "./components/jwt";
import redis from "./components/redis";
import server from "./components/server";
import swagger from "./components/swagger";
import security from "./components/security";
import socketio from "./components/socketio";

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
    server,
    swagger,
    security,
    socketio,
    isDev, isProd,
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
    server,
    swagger,
    security,
    socketio,
    isDev, isProd,
};


