// https://core.telegram.org/bots/webapps

export class L1WebAppInitParams {
    tgWebAppData: string;
    user: string;
    auth_date: string;
    hash: string;
    tgWebAppVersion: string;
    tgWebAppPlatform: string;
    tgWebAppThemeParams: string;
}


export class TgWebAppThemeParams {
    link_color: string;
    section_header_text_color: string;
    subtitle_text_color: string;
    bg_color: string;
    secondary_bg_color: string;
    hint_color: string;
    button_text_color: string;
    section_bg_color: string;
    text_color: string;
    button_color: string;
    header_bg_color: string;
    accent_text_color: string;
    destructive_text_color: string;
}

export class TgWebAppThemeParamsCC {
    linkColor: string;
    sectionHeaderTextColor: string;
    subtitleTextColor: string;
    bgColor: string;
    secondaryBgColor: string;
    hintColor: string;
    buttonTextColor: string;
    sectionBgColor: string;
    textColor: string;
    buttonColor: string;
    headerBgColor: string;
    accentTextColor: string;
    destructiveTextColor: string;
}

export class WebAppChat {
    id: number;
    type: string;
    title: string;
    username?: string;
    photo_url?: string;
}

export class WebAppUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium?: boolean = false;
    added_to_attachment_menu?: boolean = false;
    allows_write_to_pm?: boolean = false;
    photo_url?: string;
}


export class WebAppInitParams {
    query_id: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    chat?: WebAppChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: Date;
    auth_date: Date;
    hash: string;
    tgWebAppThemeParams?: TgWebAppThemeParams;
    tgWebAppVersion?: string;
    tgWebAppPlatform?: string;
}

export type WebAppAuthData = {
    query_id?: string;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    is_bot?: boolean;
    id: string;
    first_name: string;
    last_name: string;
    username?: string;
    language_code: string;
    auth_date: number | Date;
    is_premium?: boolean;
    hash: string;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;
}

export class WebAppAuthParams implements WebAppAuthData {
    query_id?: string;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    is_bot?: boolean;
    id: string;
    first_name: string;
    last_name: string;
    username?: string;
    language_code: string;
    auth_date: number | Date;
    is_premium?: boolean;
    hash: string;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;

    public toDbData() {
        return {
            id: this.id,
            username: this.username,
            firstName: this.first_name,
            lastName: this.last_name,
            language: this.language_code,
            isBot: this.is_bot,
        };
    }


    public getQueryString() {
        return ``
            + `query_id=${this.query_id}`
            + `chat_type=${this.chat_type}`
            + `chat_instance=${this.chat_instance}`
            + `&id=${this.id}`
            + `&first_name=${this.first_name}`
            + `&last_name=${this.last_name}`
            + `&username=${this.username}`
            + `&language_code=${this.language_code}`
            + `&auth_date=${(this.auth_date instanceof Date) ? this.auth_date.getTime() / 1000 : this.auth_date}`
            + `&hash=${this.hash}`
            + `&start_param=${this.start_param}`
            + (this.added_to_attachment_menu == true ? `&added_to_attachment_menu=${this.added_to_attachment_menu}` : ``)
            + (this.allows_write_to_pm == true ? `&allows_write_to_pm=${this.allows_write_to_pm}` : ``)
            + (!!this.photo_url ? `&photo_url=${this.photo_url}` : ``)
            + (this.is_bot == true ? `&is_bot=${this.is_bot}` : ``)
            + (this.is_premium == true ? `&is_premium=${this.is_premium}` : ``);
    }
}

export interface TTgWebAppParams {
    link_color: string;
    section_header_text_color: string;
    subtitle_text_color: string;
    bg_color: string;
    secondary_bg_color: string;
    hint_color: string;
    button_text_color: string;
    section_bg_color: string;
    text_color: string;
    button_color: string;
    header_bg_color: string;
    accent_text_color: string;
    destructive_text_color: string;
}

export interface TTgQueryParams {
    auth_date: string;
    hash: string;
    user: string; // This will be parsed later
    tgWebAppData: string;
    tgWebAppPlatform: string;
    tgWebAppThemeParams: string; // This will be parsed later
    tgWebAppVersion: string;
}

