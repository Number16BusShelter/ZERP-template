import { CryptoOptions } from "@zerp/types";

const cryptographyConfig: CryptoOptions = {
    keyLength: 64,
    saltLength: 16,
    iterations: 10000,
    hashAlgorithm: "sha256",
    stringEncoding: "base64url",
    inputEncoding: "utf-8",
    hashEncoding: "hex",
    delimiter: ":",
};

export default cryptographyConfig
