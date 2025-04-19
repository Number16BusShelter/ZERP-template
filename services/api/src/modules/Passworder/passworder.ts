import { createHmac, randomBytes } from "crypto";
import { CryptoOptions, SecretTokenTransport } from "@zerp/types";
import { passwords as passwordsDefaultConfigs } from "@/config";


export default class Passworder {
    constructor(private readonly options: CryptoOptions = passwordsDefaultConfigs) {}

    /**
     * Generates a secure token transport object.
     * @param secret - The secret to hash.
     * @returns An object containing hashing details.
     */
    public getSecretTokenTransport(secret: string): SecretTokenTransport {
        const salt = this.generateSalt();
        const hashed = Passworder.hashSecretToken(secret, salt, this.options);
        return {
            keyLength: this.options.keyLength,
            salt: salt,
            hashAlgorithm: this.options.hashAlgorithm,
            hashed: hashed,
            iterations: this.options.iterations,
        };
    }

    /**
     * Validates the provided secret against the stored hash.
     * @param secret - The secret to check.
     * @param transportHash - The hash string in "algorithm:iterations:keyLength:salt:hashed" format.
     * @returns True if the secret matches the hash; otherwise, false.
     */
    public checkSecret(secret: string, transportHash: string): boolean {
        const [hashAlgorithm, iterations, keyLength, salt, hashed] = transportHash.split(this.options.delimiter);
        if (!(hashAlgorithm && iterations && keyLength && salt && hashed)) {
            return false;
        }
        return hashed === Passworder.hashSecretToken(secret, salt, {
            hashAlgorithm,
            iterations: parseInt(iterations),
            keyLength: parseInt(keyLength),
            stringEncoding: this.options.stringEncoding,
            inputEncoding: this.options.inputEncoding,
            hashEncoding: this.options.hashEncoding,
            delimiter: this.options.delimiter,
        });
    }

    /**
     * Hashes a secret using the provided options.
     * @param secret - The secret to hash.
     * @param salt - The salt to use.
     * @param options - Options for hashing.
     * @returns The hashed secret as a string.
     */
    private static hashSecretToken(
        secret: string,
        salt: string,
        options: CryptoOptions
    ): string {
        const key = Buffer.from(secret, options.inputEncoding ?? "utf-8");
        const hmac = createHmac(options.hashAlgorithm, key);
        hmac.update(salt);
        return hmac.digest(options.hashEncoding ?? "hex");
    }

    /**
     * Generates a random salt.
     * @param length - Length of the salt.
     * @returns The generated salt.
     */
    private generateSalt(length: number = this.options.saltLength): string {
        return randomBytes(length).toString(this.options.stringEncoding ?? "base64url");
    }

    /**
     * Generates a random secret and hashes it.
     * @param length - Length of the random secret.
     * @returns The hashed secret.
     */
    public generateSecret(length: number = this.options.keyLength): string {
        const tokenBuffer = randomBytes(length);
        const salt = this.generateSalt();
        const token = tokenBuffer.toString(this.options.stringEncoding ?? "base64url");
        return Passworder.hashSecretToken(token, salt, this.options);
    }

    /**
     * Encodes a string to base64.
     * @param str - The string to encode.
     * @returns The base64 encoded string.
     */
    public encodeToBase64(str: string): string {
        return Buffer.from(str, this.options.inputEncoding ?? "utf-8").toString(this.options.stringEncoding ?? "base64url");
    }

    /**
     * Decodes a base64 encoded token.
     * @param token - The base64 encoded token.
     * @returns The decoded string.
     */
    public decodeBase64Token(token: string): string {
        return Buffer.from(token, this.options.stringEncoding ?? "base64url").toString(this.options.inputEncoding ?? "utf-8");
    }

    /**
     * Converts a secret token transport to a hash string.
     * @param transport - The secret token transport.
     * @returns The hash string.
     */
    public getHashFromTransport(transport: SecretTokenTransport): string {
        return `${transport.hashAlgorithm}${this.options.delimiter}${transport.iterations}${this.options.delimiter}${transport.keyLength}${this.options.delimiter}${transport.salt}${this.options.delimiter}${transport.hashed}`;
    }

    /**
     * Creates a Passworder instance from a transport hash string.
     * @param hash - The transport hash string in "algorithm:iterations:keyLength:salt:hashed" format.
     * @returns A new Passworder instance configured with the options extracted from the hash.
     */
    public static instanceFromTransportHash(hash: string): Passworder {
        const [hashAlgorithm, iterations, keyLength, salt, hashed] = hash.split(passwordsDefaultConfigs.delimiter);
        const options: CryptoOptions = {
            hashAlgorithm,
            iterations: parseInt(iterations),
            keyLength: parseInt(keyLength),
            saltLength: salt.length,
            stringEncoding: passwordsDefaultConfigs.stringEncoding,
            inputEncoding: passwordsDefaultConfigs.inputEncoding,
            hashEncoding: passwordsDefaultConfigs.hashEncoding,
            delimiter: passwordsDefaultConfigs.delimiter,
        };
        return new Passworder(options);
    }
}
