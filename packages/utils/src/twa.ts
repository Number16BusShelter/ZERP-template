import { L1WebAppInitParams, WebAppAuthParams, WebAppInitParams } from "@zerp/types";
import { plainToInstance } from "class-transformer";
import { qsParse } from "./common";
import { webcrypto } from "crypto";

/**
 * Converts web app query parameters to an object.
 * @param {string} query - The query string containing the web app initialization parameters.
 * @returns {WebAppInitParams} The web app initialization parameters object.
 */

export const webAppParamsToObject = (query: string): WebAppInitParams => {
    let l1: L1WebAppInitParams = plainToInstance(L1WebAppInitParams, qsParse<L1WebAppInitParams>(query));
    let l2: Partial<WebAppInitParams> = {};
    l2.query_id = qsParse<{query_id: string}>(l1.tgWebAppData).query_id ?? qsParse<{query_id: string}>(l1['#tgWebAppData'])['query_id'] as string;
    l2.hash = l1.hash;
    l2.tgWebAppVersion = l1.tgWebAppVersion;
    l2.tgWebAppPlatform = l1.tgWebAppPlatform;
    l2.user = JSON.parse(l1.user);
    l2.auth_date = new Date(parseInt(l1.auth_date) * 1000);
    l2.tgWebAppThemeParams = JSON.parse(l1.tgWebAppThemeParams);
    return plainToInstance(WebAppInitParams, l2);
};

/**
 * Converts web app initialization parameters to authentication parameters.
 * @param {WebAppInitParams} webAppInitParams - The web app initialization parameters.
 * @returns {WebAppAuthParams} The web app authentication parameters.
 */

export function webAppInitDataToAuthParams(webAppInitParams: WebAppInitParams): WebAppAuthParams {
    return plainToInstance(WebAppAuthParams, {
        auth_date: webAppInitParams.auth_date,
        hash: webAppInitParams.hash,
        query_id: webAppInitParams.query_id,
        // USER
        ...(webAppInitParams.user ? {
            id: webAppInitParams.user.id,
            first_name: webAppInitParams.user.first_name,
            last_name: webAppInitParams.user.last_name,
            username: webAppInitParams.user.username,
            language_code: webAppInitParams.user.language_code,
            photo_url: webAppInitParams.user.photo_url,
            is_bot: webAppInitParams.user.is_bot,
            added_to_attachment_menu: webAppInitParams.user.added_to_attachment_menu,
            allows_write_to_pm: webAppInitParams.user.allows_write_to_pm,
            is_premium: webAppInitParams.user.is_premium,
        } : {}),
    });
}

/**
 * Extracts authentication parameters from the given data.
 * @param {any} data - The data containing the authentication parameters.
 * @returns {object} The extracted authentication parameters.
 */

export function extractTWAAuthenticationParams(data: any) {
    const {
        query_id,
        id,
        chat_type,
        chat_instance,
        first_name,
        last_name,
        username,
        start_param,
        language_code,
        added_to_attachment_menu,
        allows_write_to_pm,
        is_premium,
        photo_url,
        auth_date,
        hash,
    } = data;

    return {
        auth_date: String((auth_date instanceof Date) ? auth_date.getTime() / 1000 : parseInt(auth_date)),
        query_id,
        hash,
        start_param,
        chat_type,
        chat_instance,
        user: JSON.stringify({
            id: parseInt(id),
            first_name,
            last_name,
            username,
            language_code,
            ...(is_premium ? { is_premium } : {}),
            ...(allows_write_to_pm ? { allows_write_to_pm } : {}),
            ...(added_to_attachment_menu ? { added_to_attachment_menu } : {}),
            ...(photo_url ? { photo_url } : {}),
        }),
    };
}

/**
 * Converts the query string to authentication parameters.
 * @param {string} qs - The query string containing the web app initialization parameters.
 * @returns {WebAppAuthParams} The web app authentication parameters.
 */
export const twaInitToAuth = (qs: string): WebAppAuthParams => webAppInitDataToAuthParams(webAppParamsToObject(qs));

/**
 * Validates the web app authentication data.
 * @param {object} data - The data to be validated.
 * @param {string} botToken - The bot token used for validation.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the data is valid.
 */
export async function twaValidate(data, botToken) {
    const subtle = webcrypto.subtle;
    const encoder = new TextEncoder();
    const toCheckString = (data: object) => Object.keys(data)
        .filter((key) => !!data[key] && data[key] != "undefined")
        .filter((key) => key !== "hash")
        .map((key) => `${key}=${data[key]}`)
        .sort()
        .join("\n");

    const checkString = toCheckString(data);

    const secretKey = await subtle.importKey(
        "raw",
        encoder.encode("WebAppData"),
        { name: "HMAC", hash: "SHA-256" },
        true,
        ["sign"],
    );

    const secret = await subtle.sign("HMAC", secretKey, encoder.encode(botToken));
    const signatureKey = await subtle.importKey(
        "raw",
        secret,
        { name: "HMAC", hash: "SHA-256" },
        true,
        ["sign"],
    );
    const signature = await subtle.sign(
        "HMAC",
        signatureKey,
        encoder.encode(checkString),
    );

    const hex = [...new Uint8Array(signature)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return data.hash === hex;
}
