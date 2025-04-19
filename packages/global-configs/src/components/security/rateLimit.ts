export default {
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}
