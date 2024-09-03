import { body, query } from "express-validator";

export const twaAuthorizationValidations = (location: "body" | "query") => {
    const locator = {
        "body": body,
        "query": query,
    }[location];
    return [
        locator("query_id").optional().escape().isString(),
        locator("user").optional().isString(),
        locator("receiver").optional().isString(),
        locator("chat").optional().isString(),
        locator("chat_type").optional().isString(),
        locator("chat_instance").optional().isString(),
        locator("start_param").optional().isString(),
        locator("can_send_after").optional().isInt().toInt(),
        locator("auth_date").exists().escape().toInt(),
        locator("hash").exists().escape().isString(),

        locator("id").exists().escape().isNumeric().toInt(),
        locator("username").optional().escape().isString(),
        locator("first_name").exists().escape().isString(),
        locator("last_name").exists().escape().isString(),
        locator("language_code").exists().escape().isString(),

        locator("added_to_attachment_menu").optional().escape().isBoolean().toBoolean(),
        locator("is_bot").optional().escape().isBoolean().toBoolean(),
        locator("allows_write_to_pm").optional().escape().isBoolean().toBoolean(),
        locator("is_premium").optional().escape().isBoolean().toBoolean(),
        locator("photo_url").optional().escape().isString(),
    ];
};
