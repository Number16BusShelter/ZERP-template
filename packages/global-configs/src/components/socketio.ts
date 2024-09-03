import app from "./app";
import { SocketIOConfig } from "@zerp/types";

export const socketio: SocketIOConfig = {
    port: (process.env.SOCKETIO_PORT && process.env.SOCKETIO_PORT.length > 0) ? parseInt(process.env.SOCKETIO_PORT ?? "7071") : undefined,
    pingTimeout: parseInt(process.env.PING_TIMEOUT ?? "30000"),
    pingInterval: parseInt(process.env.PING_INTERVAL ?? "3000"),
    // transports: ['websocket', 'polling'],
    cors: {
        origin: app.allowedOrigins,
        credentials: true,
    },
    // allowEIO3: true
};

export default socketio;
