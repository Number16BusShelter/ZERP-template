export default {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            // Allow WebSocket connections
            'connect-src': ["'self'", "ws:"], // Add your WebSocket server here
        },
    },
    hsts: false, // Disable HSTS if using HTTP for WebSockets
}
