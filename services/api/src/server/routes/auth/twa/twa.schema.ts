import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// WebAppUser Schema
export const WebAppUserSchema = z.object({
    id: z.number().int().positive(),
    is_bot: z.boolean().optional(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    language_code: z.string().optional(),
    is_premium: z.boolean().optional(),
    added_to_attachment_menu: z.boolean().optional(),
    allows_write_to_pm: z.boolean().optional(),
    photo_url: z.string().url().optional(),
});

// WebAppChat Schema
export const WebAppChatSchema = z.object({
    id: z.number().int().positive(),
    type: z.enum(["group", "supergroup", "channel"]),
    title: z.string(),
    username: z.string().optional(),
    photo_url: z.string().url().optional(),
});

// WebAppInitData Schema
export const WebAppInitDataSchema = z.object({
    query_id: z.string().optional(),
    user: WebAppUserSchema.optional(),
    receiver: WebAppUserSchema.optional(),
    chat: WebAppChatSchema.optional(),
    chat_type: z.enum(["sender", "private", "group", "supergroup", "channel"]).optional(),
    chat_instance: z.string().optional(),
    start_param: z.string().optional(),
    can_send_after: z.number().int().optional(),
    auth_date: z.number().int(),
    hash: z.string(),
});
export type WebAppInitData = z.infer<typeof WebAppInitDataSchema>;

export const JWTTokenSchema = z.object({
    token: z.string()
        .openapi({
            description: `JWT token that can be used both`
                + ` for socket and other routes authorization`,
        }),
    loggedIn: z.number()
        .openapi({
            description: `Logged in at in timestamp`,
            format: "timestamp",
        }),
    expires: z.number()
        .openapi({
            description: `Date of JWT expiration`,
            format: "timestamp",
        }),
});
