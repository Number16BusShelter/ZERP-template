import * as querystring from "querystring";
import crypto from "crypto";

type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export function deepSortObject<T extends JSONValue>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(deepSortObject) as T;
    } else if (typeof obj === "object" && obj !== null) {
        const sortedObj = Object.keys(obj)
            .sort()
            .reduce((sorted, key) => {
                (sorted as JSONObject)[key] = deepSortObject((obj as JSONObject)[key]);
                return sorted;
            }, {} as JSONObject);
        return sortedObj as T;
    }
    return obj;
}

export function getObjectHash<T extends JSONValue>(obj: T): string {
    const sortedObj = deepSortObject(obj);
    const jsonString = JSON.stringify(sortedObj);
    return crypto.createHash("sha256").update(jsonString).digest("hex");
}

export function checkUUID(s: string) {
    const pattern = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return !!s.match(pattern);
}

export const generateRandomString =
    length => crypto.randomBytes(Math.ceil(length * 3 / 4))
        .toString("base64").substring(0, length);


export const qsParse = <T = any>(s: string): T => querystring.parse(decodeURIComponent(s)) as T;


export const makeShortDate = (date) => {
    let yy = date.getFullYear();
    let mm = date.getMonth();
    let dd = date.getDate();
    return `${yy}-${(mm < 10) ? 0 : ""}${mm + 1}-${(dd < 10) ? 0 : ""}${dd}`;
};

export function isValidTimestamp(_timestamp) {
    const newTimestamp = new Date(_timestamp).getTime();
    return isNumeric(newTimestamp);
}

export function isNumeric(value) {
    return /^\d+$/.test(value);
}

export const isLatitude = (num, { req }) => isFinite(num) && Math.abs(num) <= 90 ? () => {
    throw new Error("Not a valid latitude");
} : null;

export const isLongitude = (num, { req }) => isFinite(num) && Math.abs(num) <= 180 ? () => {
    throw new Error("Not a valid longitude");
} : null;

export const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
