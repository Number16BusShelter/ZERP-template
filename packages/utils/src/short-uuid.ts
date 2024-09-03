import short from "short-uuid"

// const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

/**
 * shortUUID is a class for shortening and unwrapping
 * @class
 * @name shortUuid
 * */

export class shortUuid {
    private static readonly translator = short(short.constants.flickrBase58, {
        consistentLength: true
    });
    /**
     * "from" - is meant to get shortened UUID
     * @public
     * @name from
     * @static
     * @returns {string} - shortened UUID
     */
    public static from = (uuid): string => {
        return shortUuid.translator.fromUUID(uuid);
    }

    /**
     * "to" - is meant unwrap UUID
     * @public
     * @name to
     * @static
     * @returns {string} - unwrapped UUID
     */
    public static to = (uuid): string => {
        return shortUuid.translator.toUUID(uuid);
    }
}

