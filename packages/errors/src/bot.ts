/**
 * Generic bot failure
 * @param {string} message
 * @property {number} code: 7000
 * @name BotError
 * */

export class BotError extends Error {
    public static code = 7000
    public static GENERIC_BOT_ERROR = (error: string, updateType?: string) => updateType
        ? `Bot error occurred on ${updateType}!\n${error}`
        : `Bot error occurred!\n${error}`

    constructor(message: string, updateType?: string) {
        super(BotError.GENERIC_BOT_ERROR(message, updateType));
        Object.setPrototypeOf(this, BotError.prototype);
    }
}

/**
 * Language not provided in dictionary
 * @param {string} language
 * @property {number} code: 7001
 * @name UnsupportedLanguageError
 * */

export class UnsupportedLanguageError extends BotError {
    public static code = 7001
    public static UNSUPPORTED_LANGUAGE_ERROR = (language: string) => `Unsupported language ${language} was chosen. `

    constructor(language: string) {
        super(UnsupportedLanguageError.UNSUPPORTED_LANGUAGE_ERROR(language));
        Object.setPrototypeOf(this, UnsupportedLanguageError.prototype);
    }
}

/**
 * Phrase not provided in dictionary
 * @param {string} language
 * @property {number} code: 7002
 * @name UnsupportedPhraseError
 * */

export class UnsupportedPhraseError extends BotError {
    public static code = 7002
    public static UNSUPPORTED_PHRASE_ERROR = (language: string, phrase: string) => `Phrase '${phrase}' not found in '{language}' language dictionary. `

    constructor(language: string, phrase: string) {
        super(UnsupportedPhraseError.UNSUPPORTED_PHRASE_ERROR(language, phrase));
        Object.setPrototypeOf(this, UnsupportedLanguageError.prototype);
    }
}

/**
 * Phrase not provided in dictionary
 * @param {string} language
 * @property {number} code: 7002
 * @name UnsupportedPhraseError
 * */

export class UnknownCallbackQueryScenario extends BotError {
    public static code = 7010
    public static UNKNOWN_CALLBACK_ERROR = (scenario: string) => `Failed to resolve callback query scenario "${scenario}"`

    constructor(scenario: string) {
        super(UnknownCallbackQueryScenario.UNKNOWN_CALLBACK_ERROR(scenario));
        Object.setPrototypeOf(this, UnknownCallbackQueryScenario.prototype);
    }
}
